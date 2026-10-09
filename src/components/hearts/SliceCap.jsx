import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const Z = new THREE.Vector3(0, 0, 1)
const ignoreRaycast = () => {}

// Render at the canvas root: clipping planes use world coordinates.
export function SliceCap({ clipPlane, capStyleRef, fallbackColor = '#a82030', size = 1000 }) {
  const ref = useRef()
  const matRef = useRef()

  useFrame(() => {
    if (ref.current && clipPlane) {
      const normal = clipPlane.normal.clone().normalize()
      ref.current.position.copy(normal).multiplyScalar(-clipPlane.constant)
      ref.current.quaternion.setFromUnitVectors(Z, normal)
    }
    if (matRef.current) {
      const style = capStyleRef?.current
      matRef.current.color.set(style?.color ?? fallbackColor)
      matRef.current.roughness = style?.roughness ?? 0.6
      matRef.current.metalness = style?.metalness ?? 0
    }
  })

  if (!clipPlane) return null

  return (
    <mesh
        ref={ref}
        layers={1}
        renderOrder={11}
        raycast={ignoreRaycast}
        onAfterRender={(renderer) => renderer.clearStencil()}>
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
