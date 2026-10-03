import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const defaultNormal = new THREE.Vector3(0, 0, 1)

// The indicator sits this far (in model units) toward the removed side of the cut,
// so it never shares depth values with the cap
const CAP_SEPARATION = 0.6

export function SlicePlaneHelper({ clipPlane, size = 180, visible = true }) {
  const groupRef = useRef(null)

  useFrame(() => {
    if (!groupRef.current || !clipPlane || !visible) return

    const normal = clipPlane.normal.clone().normalize()
    const constant = clipPlane.constant

    // position on the plane closest to world origin: P = -constant * normal,
    // then pushed slightly off the cut surface
    const planeOrigin = normal.clone().multiplyScalar(-constant - CAP_SEPARATION)
    groupRef.current.position.copy(planeOrigin)

    // precisely rotate default +Z normal of PlaneGeometry to match clipPlane.normal
    groupRef.current.quaternion.setFromUnitVectors(defaultNormal, normal)
  })

  if (!clipPlane || !visible) return null

  return (
    <group ref={groupRef}>
      {/* Semi-transparent planar surface */}
      <mesh renderOrder={100}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Perimeter boundary highlight */}
      <lineSegments renderOrder={101}>
        <edgesGeometry args={[new THREE.PlaneGeometry(size, size)]} />
        <lineBasicMaterial
          color="#0284c7"
          linewidth={2}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}