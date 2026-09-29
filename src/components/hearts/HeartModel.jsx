import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const NUM_FRAMES = 25
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
  const model = useMemo(() => scene.clone(true), [scene]);
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
    epiMeshRef.current.raycast = showEpi
      ? THREE.Mesh.prototype.raycast
      : () => {}
  }, [showEpi])

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

    onClick={(event) => {
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
  beatInterval,
  onHover,
  onSelect,
  ...props
}) {
  const framePath = Array.from({ length: NUM_FRAMES }, (_, i) => `/${frameFolder}/frame_${(i+18) % NUM_FRAMES}.glb`)
  const [activeFrame, setActiveFrame] = useState(0)
  const animState = useRef({ elapsed: 0, currentFrame: 0 })
  const isUnhealthy = frameFolder !== "frames"


  useFrame((_, delta) => {
    // stop advancing the animation timeline if paused
    if (isPaused) return

    // how long should the frame be showm? calculated below
    const cycleDuration = 60.0 / bpm
    const frameInterval = cycleDuration / NUM_FRAMES

    animState.current.elapsed += delta
    beatInterval?.(animState.current.elapsed)

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
      {framePath.map((path, idx) => (
        <SingleFrame
          key={path}
          url={path}
          isVisible={idx === activeFrame}
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