import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const NUM_FRAMES = 25
// loads all the frames path into an array and iterates over all of them
const FRAME_PATHS = Array.from({ length: NUM_FRAMES }, (_, i) => `/frames/frame_${i}.glb`)

// function essentially displays only one frame at a time and only loads one frame at a time.
// all 25 frames are loaded into gpu memory but only active frame is visible
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
  const animState = useRef({ elapsed: 0, currentFrame: 0 })

  useFrame((_, delta) => {
    // stop advancing the animation timeline if paused
    if (isPaused) return

    // how long should the frame be showm? calculated below
    const cycleDuration = 60.0 / bpm
    const frameInterval = cycleDuration / NUM_FRAMES

    animState.current.elapsed += delta

    const targetFrame = Math.floor(
      (animState.current.elapsed % cycleDuration) / frameInterval
    )

    //checks if the current frame is the correct frame, if not
    //set the frame to the correct frame
    if (targetFrame !== animState.current.currentFrame) {
      animState.current.currentFrame = targetFrame
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