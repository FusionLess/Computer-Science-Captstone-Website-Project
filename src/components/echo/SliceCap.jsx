import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const Z = new THREE.Vector3(0, 0, 1)

// HeartModel writes the myocardium's real material values here once the GLB loads,
// so the cap matches the muscle exactly instead of using a hand-picked colour.
export const capStyle = { color: null, roughness: null, metalness: null }

// Draws a flat "muscle" cap on the clip plane, but only where the stencil
// buffer says the plane intersects the myocardium volume.
// Must be rendered at the world root (not inside <Center> or a rotated group),
// because clipping planes are evaluated in world space.
export function SliceCap({ clipPlane, fallbackColor = '#a82030', size = 1000 }) {
  const ref = useRef()
  const matRef = useRef()

  useFrame(() => {
    if (ref.current && clipPlane) {
      const n = clipPlane.normal.clone().normalize()
      ref.current.position.copy(n).multiplyScalar(-clipPlane.constant)
      ref.current.quaternion.setFromUnitVectors(Z, n)
    }
    if (matRef.current && capStyle.color) {
      matRef.current.color.copy(capStyle.color)
      if (capStyle.roughness !== null) matRef.current.roughness = capStyle.roughness
      if (capStyle.metalness !== null) matRef.current.metalness = capStyle.metalness
    }
  })

  if (!clipPlane) return null

  return (
    <mesh
      ref={ref}
      renderOrder={11}
      onAfterRender={(renderer) => renderer.clearStencil()}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        ref={matRef}
        color={fallbackColor}
        roughness={0.6}
        metalness={0}
        side={THREE.DoubleSide}
        stencilWrite
        stencilRef={0}
        stencilFunc={THREE.NotEqualStencilFunc}
        stencilFail={THREE.ReplaceStencilOp}
        stencilZFail={THREE.ReplaceStencilOp}
        stencilZPass={THREE.ReplaceStencilOp}
      />
    </mesh>
  )
}