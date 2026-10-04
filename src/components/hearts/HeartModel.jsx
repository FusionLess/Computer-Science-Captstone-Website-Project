import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const NUM_FRAMES = 75
const ES_FRAME = 25
// loads all the frames path into an array and iterates over all of them

// function essentially displays only one frame at a time and only loads one frame at a time.
// all 25 frames are loaded into gpu memory but only active frame is visible
const UNHEALTHY_MESH_MAP = {
  mesh0: 'mesh0',
  mesh1: 'mesh4',
  mesh2: 'mesh1',
  mesh3: 'mesh5',
  mesh4: 'mesh2',
  mesh5: 'mesh6',
  mesh6: 'mesh3',
}
function SingleFrame({ url, isVisible, showEpi, ventricleOnly, clipPlane, onHover, onSelect, isUnhealthy}) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => {
    const clonedModel = scene.clone(true)

    // Returning false stops the raycaster from checking hidden frames' children.
    clonedModel.raycast = () => clonedModel.visible ? undefined : false

    clonedModel.traverse((child) => {
      if (!child.isMesh) return
      const originalRaycast = child.raycast
      child.raycast = function (raycaster, intersections) {
        if (!this.visible) return false
        return originalRaycast.call(this, raycaster, intersections)
      }
    })

    return clonedModel
  }, [scene])
  const epiMeshRef = useRef(null)

  const newMeshName = (meshName) => {
    if (!isUnhealthy) return meshName
    return UNHEALTHY_MESH_MAP[meshName] ?? meshName
  }
  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh) return
      const meshName = newMeshName(child.name)

      if (meshName === "mesh0") {
        child.visible = showEpi
        return
      }

      if (ventricleOnly) {
        // Only LV + RV
        child.visible =
          meshName === "mesh1" ||
          meshName === "mesh4"
      } else {
        // Show all internal structures
        child.visible = true
      }
    })
  }, [model, ventricleOnly, showEpi, isUnhealthy])

  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        const isEpi = child.name === 'mesh0' || child.name.toLowerCase().includes('epi')
        
        if (isEpi) {
          epiMeshRef.current = child
        }

        if (child.material) {
          child.material.side = THREE.DoubleSide
          child.material.flatShading = false
          // Solid opaque rendering prevents see-through ghosting
          child.material.transparent = false
          child.material.depthWrite = true

          // forces GPU to prioritize outer shell over inner cavities when facing camera
          if (isEpi) {
            child.renderOrder = 2
            child.material.polygonOffset = true
            child.material.polygonOffsetFactor = -1.0 // pulls epicardium closer to camera
            child.material.polygonOffsetUnits = -1.0
          } else {
            child.renderOrder = 1
            child.material.polygonOffset = true
            child.material.polygonOffsetFactor = 1.0  // pushes internal chambers back
            child.material.polygonOffsetUnits = 1.0
          }

          child.material.needsUpdate = true
        }
      }
    })
  }, [model])

  useEffect(() => {
    if (epiMeshRef.current) {
      epiMeshRef.current.visible = showEpi
    }
  }, [model, showEpi])

  useEffect(() => {
    const planes = clipPlane ? [clipPlane] : []
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.clippingPlanes = planes
        child.material.needsUpdate = true
      }
    })
  }, [model, clipPlane])

  return  (
    <primitive object={model} visible={isVisible}
      onPointerMove={(event) => {
      event.stopPropagation()

      const rawMeshName = event.object.name
      const meshName = newMeshName(rawMeshName)

      if (!showEpi && meshName === 'mesh0') {
        return
      }

      onHover?.({
        name: meshName,
        x: event.clientX,
        y: event.clientY
      })
    }}

    onPointerOut={(event) => {
      event.stopPropagation()
      onHover?.(null)
    }}

    onPointerDown={(event) => {
      event.stopPropagation()
      const rawMeshName = event.object.name
      const meshName = newMeshName(rawMeshName)

      if (!showEpi && meshName === 'mesh0') {
        return
      }
      onSelect?.(meshName)
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
  beatInterval,
  onHover,
  onSelect,
  ...props
}) {
  const framePath = Array.from({ length: NUM_FRAMES }, (_, i) => `/${frameFolder}/frame_${(i+18) % NUM_FRAMES}.glb`)
  const [activeFrame, setActiveFrame] = useState(0)
  const animElapsed = useRef(0)
  const totalElapsed = useRef(0)
  const currentFrameRef = useRef(0)

  const safeBpm = Number(bpm) || 60
  const isUnhealthy = frameFolder !== "frames"
  // MRI playback supplies the cycle position so both views use the same frame clock.
  const displayedFrame = animationPhase === undefined
    ? activeFrame
    : Math.min(Math.max(Math.floor(animationPhase * NUM_FRAMES), 0), NUM_FRAMES - 1)

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

          onHover={onHover}
          onSelect={onSelect}
          isUnhealthy={isUnhealthy}

        />
      ))}
    </group>
  )
}

// FRAME_PATHS.forEach((path) => useGLTF.preload(path))
