import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const NUM_FRAMES = 75
const ES_FRAME = 25
// loads all the frames path into an array and iterates over all of them
const FRAME_PATHS = Array.from({ length: NUM_FRAMES }, (_, i) => `/frames/frame_${i}.glb`)

// function essentially displays only one frame at a time and only loads one frame at a time.
// all 75 frames are loaded into gpu memory but only active frame is visible
function SingleFrame({ url, isVisible, showEpi, clipPlane }) {
  const { scene } = useGLTF(url)
  const epiMeshRef = useRef(null)

  useEffect(() => {
    scene.traverse((child) => {
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
  }, [scene])

  useEffect(() => {
    if (epiMeshRef.current) {
      epiMeshRef.current.visible = showEpi
    }
  }, [showEpi])

  useEffect(() => {
    const planes = clipPlane ? [clipPlane] : []
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.clippingPlanes = planes
        child.material.needsUpdate = true
      }
    })
  }, [scene, clipPlane])

  return <primitive object={scene} visible={isVisible} />
}

export function HeartModel({
  bpm = 60,
  showEpi = true,
  clipPlane = null,
  isPaused = false,
  ...props
}) {
  const [activeFrame, setActiveFrame] = useState(0)
  const animElapsed = useRef(0)
  const currentFrameRef = useRef(0)

  const safeBpm = Number(bpm) || 60

  useFrame((_, delta) => {
    // stop advancing the animation timeline if paused
    if (isPaused) return

    // Cap delta to prevent frame spikes when dragging the slider
    const dt = Math.min(delta, 0.05)

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
      {FRAME_PATHS.map((path, idx) => (
        <SingleFrame
          key={path}
          url={path}
          isVisible={idx === activeFrame}
          showEpi={showEpi}
          clipPlane={clipPlane}
        />
      ))}
    </group>
  )
}

FRAME_PATHS.forEach((path) => useGLTF.preload(path))