import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const defaultNormal = new THREE.Vector3(0, 0, 1)

export function SlicePlaneHelper({ clipPlane, size = 180, visible = true }) {
  const groupRef = useRef(null)

  useFrame(() => {
    if (!groupRef.current || !clipPlane || !visible) return

    const normal = clipPlane.normal.clone().normalize()
    const constant = clipPlane.constant

    // position on the plane closest to world origin: P = -constant * normal
    const planeOrigin = normal.clone().multiplyScalar(-constant)
    groupRef.current.position
        .copy(planeOrigin)
        .addScaledVector(normal, -0.5)

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