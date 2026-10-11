import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { HEART_FRAME_COUNT, phaseToFrame, cloneHeartScene, addStencilHelpers, materialsOf, isMuscle } from './heartRendering'
import { HeartParts } from "../../data/HeartParts"

const NUM_FRAMES = HEART_FRAME_COUNT
const ES_FRAME = 25
// All frames are loaded; only the active frame is displayed.
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
      const name = child.name
      child.visible = isMuscle(child)
        ? showEpi
        : !ventricleOnly || name === 'mesh1' || name === 'mesh4'
    })
  }, [model, showEpi, ventricleOnly])

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
        const meshId = event.object.name
        const heartPart = HeartParts[meshId]  
        onHover?.({
          name: heartPart?.name ?? meshId,
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
        onSelect?.(event.object.name)
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
  beatPhase = 0,
  animationPhase = undefined,
  capStyleRef,
  capColor = null,
  onHover,
  onSelect,
  ...props
}) {
  const framePath = useMemo(() => Array.from({ length: NUM_FRAMES }, (_, i) => `/${frameFolder}/frame_${(i+46) % NUM_FRAMES}.glb`), [frameFolder])
  const safeBpm = Number(bpm) || 60
  const isUnhealthy = frameFolder !== "frames"
  const tCycle = 60 / safeBpm
  // Preserve the existing systole/diastole timing while both hearts share one beat phase.
  const tSys = Math.min(Math.max(0.413 - 0.0017 * safeBpm, 0.18), tCycle * 0.48)
  const tLocal = beatPhase * tCycle
  const heartFrame = tLocal < tSys
    ? Math.floor((tLocal / tSys) * ES_FRAME)
    : ES_FRAME + Math.floor(((tLocal - tSys) / (tCycle - tSys)) * (NUM_FRAMES - ES_FRAME))

  // MRI and Echo playback still supply their own cycle position.
  const displayedFrame = animationPhase === undefined
    ? Math.min(Math.max(heartFrame, 0), NUM_FRAMES - 1)
    : phaseToFrame(animationPhase)

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
