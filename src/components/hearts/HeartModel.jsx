import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { HEART_FRAME_COUNT, phaseToFrame, cloneHeartScene, addStencilHelpers, materialsOf, isMuscle } from './heartRendering'

const NUM_FRAMES = HEART_FRAME_COUNT
const ES_FRAME = 25
// All frames are loaded; only the active frame is displayed.
const UNHEALTHY_MESH_MAP = {
  mesh0: 'mesh0',
  mesh1: 'mesh4',
  mesh2: 'mesh1',
  mesh3: 'mesh5',
  mesh4: 'mesh2',
  mesh5: 'mesh6',
  mesh6: 'mesh3',
}
function meshNameFor(name, isUnhealthy) {
  return isUnhealthy ? (UNHEALTHY_MESH_MAP[name] ?? name) : name
}

function SingleFrame({ url, isVisible, showEpi, ventricleOnly, clipPlane, onHover, onSelect, isUnhealthy, capStyleRef, capColor }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => cloneHeartScene(scene), [scene])

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
      const name = meshNameFor(child.name, isUnhealthy)
      child.visible = isMuscle(child)
        ? showEpi
        : !ventricleOnly || name === 'mesh1' || name === 'mesh4'
    })
  }, [model, showEpi, ventricleOnly, isUnhealthy])

  useEffect(() => {
    if (!clipPlane) return
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

  useEffect(() => {
    if (!isVisible || !capStyleRef) return
    capStyleRef.current = null
    model.traverse((child) => {
      if (!child.isMesh || !isMuscle(child)) return
      const material = materialsOf(child)[0]
      capStyleRef.current = {
        color: capColor
          ? new THREE.Color(capColor)
          : child.geometry.attributes.color ? null : material.color?.clone(),
        roughness: material.roughness,
        metalness: material.metalness,
      }
    })
  }, [model, isVisible, capStyleRef, capColor])

  return (
    <primitive object={model} visible={isVisible}
      onPointerMove={(event) => {
        event.stopPropagation()
        onHover?.({
          name: meshNameFor(event.object.name, isUnhealthy),
          x: event.clientX,
          y: event.clientY,
        })
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onHover?.(null)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        onSelect?.(meshNameFor(event.object.name, isUnhealthy))
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
  const framePath = useMemo(() => Array.from(
    { length: NUM_FRAMES }, (_, i) => `/${frameFolder}/frame_${i}.glb`
  ), [frameFolder])
  const [activeFrame, setActiveFrame] = useState(0)
  const animElapsed = useRef(0)
  const totalElapsed = useRef(0)
  const currentFrameRef = useRef(0)

  const safeBpm = Number(bpm) || 60
  const isUnhealthy = frameFolder !== "frames"
  // MRI playback supplies the cycle position so both views use the same frame clock.
  const displayedFrame = animationPhase === undefined
    ? activeFrame
    : phaseToFrame(animationPhase)

  useFrame((_, delta) => {
    if (animationPhase !== undefined) return

    // stop advancing the animation timeline if paused
    if (isPaused || bpm <= 0) return

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

    // Direct ref check prevents frame thrashing and guarantees state stability
    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame
      setActiveFrame(targetFrame)
    }
  })

  return (
    <group {...props}>
      {framePath.map((path, idx) => (
        <SingleFrame
          key={path}
          url={path}
          isVisible={idx === displayedFrame}
          showEpi={showEpi}
          ventricleOnly={ventricleOnly}
          clipPlane={clipPlane}
          capStyleRef={capStyleRef}
          capColor={capColor}

          onHover={onHover}
          onSelect={onSelect}
          isUnhealthy={isUnhealthy}

        />
      ))}
    </group>
  )
}

// FRAME_PATHS.forEach((path) => useGLTF.preload(path))
