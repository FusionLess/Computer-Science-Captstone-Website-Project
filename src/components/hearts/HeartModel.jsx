import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { HEART_FRAME_COUNT, phaseToFrame, cloneHeartScene, addStencilHelpers, materialsOf, isMuscle } from './heartRendering'
import { HeartParts } from "../../data/HeartParts"

const NUM_FRAMES = HEART_FRAME_COUNT
const ES_FRAME = 25
// All frames are loaded; only the active frame is displayed.
function SingleFrame({ url, frameIndex, framesRef, showEpi, ventricleOnly, clipPlane, onHover, onSelect, capColor }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => {
    const clone = cloneHeartScene(scene)
    clone.visible = false
    return clone
  }, [scene])

  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh || child.name === 'stencilHelper') return
      const muscle = isMuscle(child)
      child.renderOrder = muscle ? 12 : 13
      materialsOf(child).forEach((material) => {
        material.side = THREE.DoubleSide
        material.flatShading = false
        material.transparent = false
        material.depthWrite = true
        material.polygonOffset = true
        material.polygonOffsetFactor = muscle ? -1 : 1
        material.polygonOffsetUnits = muscle ? -1 : 1
        material.needsUpdate = true
      })
    })
    return () => {
      model.traverse((child) => {
        if (child.isMesh && child.name !== 'stencilHelper') {
          materialsOf(child).forEach((material) => material.dispose())
        }
      })
    }
  }, [model])

  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh || child.name === 'stencilHelper') return
      const name = child.name
      child.visible = isMuscle(child)
        ? showEpi
        : !ventricleOnly || name === 'mesh1' || name === 'mesh4'
    })
  }, [model, showEpi, ventricleOnly])

  useEffect(() => {
    if (!clipPlane || !showEpi) return
    return addStencilHelpers(model, clipPlane)
  }, [model, clipPlane])

  useEffect(() => {
    const planes = clipPlane ? [clipPlane] : []
    model.traverse((child) => {
      if (!child.isMesh) return
      materialsOf(child).forEach((material) => {
        material.clippingPlanes = planes
        material.needsUpdate = true
      })
    })
  }, [model, clipPlane])

  const capStyle = useMemo(() => {
    let style = null
    model.traverse((child) => {
      if (!child.isMesh || !isMuscle(child)) return
      const material = materialsOf(child)[0]
      style = {
        color: capColor
          ? new THREE.Color(capColor)
          : child.geometry.attributes.color ? null : material.color?.clone(),
        roughness: material.roughness,
        metalness: material.metalness,
      }
    })
    return style
  }, [model, capColor])

  useLayoutEffect(() => {
    const frames = framesRef.current
    frames[frameIndex] = { model, capStyle }
    return () => { delete frames[frameIndex] }
  }, [model, capStyle, frameIndex, framesRef])

  const getSelectedMesh = (event) => {
    if (!clipPlane || !showEpi || !isMuscle(event.object)) {
      return event.object
    }

    const ventricleHit = event.intersections.find(hit =>
        hit.eventObject === event.eventObject &&
        (hit.object.name === 'mesh1' || hit.object.name === 'mesh4') &&
        Math.abs(hit.distance - event.distance) <= 0.01
    )

    return ventricleHit?.object ?? event.object
  }

  return (
    <primitive object={model}
      onPointerMove={(event) => {
       const mesh = getSelectedMesh(event)
       event.stopPropagation()

       onHover?.({
         name: HeartParts[mesh.name]?.name ?? mesh.name,
         x: event.clientX,
         y: event.clientY,
       })
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onHover?.(null)
      }}
      onPointerDown={(event) => {
       const mesh = getSelectedMesh(event)
       event.stopPropagation()

       onSelect?.(mesh.name)
      }}
    />
  )
}
export function HeartModel({
  frameFolder = "frames",
  bpm = 60,
  showEpi = true,
  ventricleOnly = false,
  clipPlane = null,
  isPaused = false,
  animationPhase = undefined,
  capStyleRef,
  capColor = null,
  beatInterval,
  onHover,
  onSelect,
  ...props
}) {
  const framePath = useMemo(() => Array.from({ length: NUM_FRAMES }, (_, i) => `/${frameFolder}/frame_${(i+56) % NUM_FRAMES}.glb`), [frameFolder])
  const framesRef = useRef([])
  const animElapsed = useRef(0)
  const totalElapsed = useRef(0)
  const currentFrameRef = useRef(0)

  const safeBpm = Number(bpm) || 60
  const displayFrame = (targetFrame) => {
    const next = framesRef.current[targetFrame]
    if (!next) return
    const previous = framesRef.current[currentFrameRef.current]
    if (previous && previous !== next) previous.model.visible = false
    next.model.visible = true
    currentFrameRef.current = targetFrame
    if (capStyleRef) capStyleRef.current = next.capStyle
  }

  useFrame((_, delta) => {
    // Imaging views own their timeline, including manual scrubbing while paused.
    if (animationPhase !== undefined) {
      displayFrame(phaseToFrame(animationPhase))
      return
    }
    if (isPaused || bpm <= 0) {
      displayFrame(currentFrameRef.current)
      return
    }

    // Cap delta to prevent frame spikes when dragging the slider
    const dt = Math.min(delta, 0.05)

    // The graph spans multiple beats, so its elapsed time must not wrap each cycle.
    totalElapsed.current += dt
    beatInterval?.(totalElapsed.current)

    // 1. Total R-R interval in seconds
    const tCycle = 60.0 / safeBpm

    // 2. Weissler's formula for true physiological systolic duration
    // Scale smoothly so systole never takes more than 50% of the cycle at extreme BPMs
    const maxSysFraction = tCycle * 0.48
    const tSysCalculated = 0.413 - 0.0017 * safeBpm
    const tSys = Math.min(Math.max(tSysCalculated, 0.18), maxSysFraction)

    // 3. Diastolic duration absorbs the rest of the cardiac interval
    const tDia = tCycle - tSys

    animElapsed.current = (animElapsed.current + dt) % tCycle
    const tLocal = animElapsed.current

    let targetFrame = 0

    if (tLocal < tSys) {
      // --- SYSTOLIC PHASE (Frames 0 -> ES_FRAME) ---
      // Rapid contraction & ejection
      const progressSys = tLocal / tSys
      targetFrame = Math.floor(progressSys * ES_FRAME)
    } else {
      // --- DIASTOLIC PHASE (Frames ES_FRAME -> NUM_FRAMES) ---
      // Variable relaxation & passive/active filling
      const tDiaElapsed = tLocal - tSys
      const progressDia = tDiaElapsed / tDia
      targetFrame = ES_FRAME + Math.floor(progressDia * (NUM_FRAMES - ES_FRAME))
    }

    targetFrame = Math.min(Math.max(targetFrame, 0), NUM_FRAMES - 1)

    // Switch scene visibility directly without reconciling all 75 React children.
    displayFrame(targetFrame)
  })

  return (
    <group {...props}>
      {framePath.map((path, idx) => (
        <SingleFrame
          key={path}
          url={path}
          frameIndex={idx}
          framesRef={framesRef}
          showEpi={showEpi}
          ventricleOnly={ventricleOnly}
          clipPlane={clipPlane}
          capColor={capColor}

          onHover={onHover}
          onSelect={onSelect}

        />
      ))}
    </group>
  )
}
