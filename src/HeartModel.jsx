import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { loadCoreBundle, loadVesselsBundle, evaluateStructureFrame } from './heartPackDecode'
import { capStyle } from './SliceCap'

const NUM_FRAMES = 75
const ES_FRAME = 25

const RO_STENCIL = 10
const RO_MYO = 12
const RO_OTHER = 13
const RO_VESSELS = 14

export function HeartModel({
  bpm = 60,
  showEpi = true,
  showArteries = true,
  showVeins = true,
  clipPlane = null,
  isPaused = false,
  forcedFrame = null,
  framesDir = '/frames',
  capColor = null,
  ...props
}) {
  const [coreLoaded, setCoreLoaded] = useState(false)
  const [renderItems, setRenderItems] = useState([])
  const itemsRef = useRef([])
  const myoMeshRef = useRef(null)
  const stencilHelperRef = useRef(null)
  const centerOffsetRef = useRef(new THREE.Vector3())
  const animElapsed = useRef(0)
  const hasClip = !!clipPlane
  const { invalidate } = useThree()

  const createMeshItem = (s, idx) => {
    const name = (s.name || '').toLowerCase()
    const isMyo = name === 'myo' || name === 'mesh0' || idx === 0
    const isVein = name.includes('vein')
    const isArtery = name.includes('arter')

    let mat
    if (isMyo) {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9b2226'),
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.FrontSide,
        depthWrite: true,
      })
      mat.polygonOffset = true
      mat.polygonOffsetFactor = 2.0
      mat.polygonOffsetUnits = 2.0

      if (capColor) {
        capStyle.color = new THREE.Color(capColor)
      } else {
        capStyle.color = mat.color.clone()
      }
      capStyle.roughness = 0.55
      capStyle.metalness = 0.05
    } else if (s.bundle === 'vessels') {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(isVein ? '#2b4cb3' : '#d83a3a'),
        roughness: 0.35,
        metalness: 0.05,
        side: THREE.FrontSide, // Crucial: prevents backfaces of the tube fighting frontfaces
        depthWrite: true,
      })
    } else {
      const c = s.material?.color || [1.0, 1.0, 1.0]
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(c[0], c[1], c[2]),
        roughness: s.material?.roughness ?? 0.5,
        metalness: s.material?.metalness ?? 0.05,
        side: THREE.DoubleSide,
        depthWrite: true,
      })
      mat.polygonOffset = true
      mat.polygonOffsetFactor = isVein ? -4.0 : -2.0
      mat.polygonOffsetUnits = isVein ? -4.0 : -2.0
    }

    const mesh = new THREE.Mesh(s.geometry, mat)
    mesh.name = s.name || `mesh_${idx}`
    mesh.renderOrder = isMyo ? RO_MYO : s.bundle === 'vessels' ? RO_VESSELS : RO_OTHER

    if (isMyo && !myoMeshRef.current) myoMeshRef.current = mesh

    return { struct: s, mesh, isVein, isArtery, isMyo }
  }

  // Phase 1: Core bundle loads first; Phase 2: Vessels stream in background
  useEffect(() => {
    let active = true

    loadCoreBundle(framesDir)
      .then(({ manifest, totalFrames, structures }) => {
        if (!active) return

        // 1. Establish bounding box and center offset from core structures
        const masterBox = new THREE.Box3()
        structures.forEach((s) => {
          evaluateStructureFrame(s, 0.0)
          s.geometry.computeBoundingBox()
          if (s.geometry.boundingBox) masterBox.union(s.geometry.boundingBox)
        })

        const centerOffset = new THREE.Vector3()
        masterBox.getCenter(centerOffset)
        centerOffsetRef.current.copy(centerOffset)

        // 2. Translate Core coordinates to center
        structures.forEach((s) => {
          s.geometry.translate(-centerOffset.x, -centerOffset.y, -centerOffset.z)
          for (let i = 0; i < s.basePositions.length; i += 3) {
            s.basePositions[i + 0] -= centerOffset.x
            s.basePositions[i + 1] -= centerOffset.y
            s.basePositions[i + 2] -= centerOffset.z
          }
          s.geometry.computeBoundingBox()
        })

        const coreItems = structures.map((s, idx) => createMeshItem(s, idx))
        itemsRef.current = coreItems
        setRenderItems([...coreItems])
        setCoreLoaded(true)
        invalidate()

        // 3. Stream vessels in background
        loadVesselsBundle(framesDir, manifest, totalFrames)
          .then((vesselStructures) => {
            if (!active) return

            const offset = centerOffsetRef.current
            vesselStructures.forEach((s) => {
              evaluateStructureFrame(s, 0.0)
              s.geometry.translate(-offset.x, -offset.y, -offset.z)
              for (let i = 0; i < s.basePositions.length; i += 3) {
                s.basePositions[i + 0] -= offset.x
                s.basePositions[i + 1] -= offset.y
                s.basePositions[i + 2] -= offset.z
              }
              s.geometry.computeBoundingBox()
            })

            const vesselItems = vesselStructures.map((s, idx) => createMeshItem(s, coreItems.length + idx))
            itemsRef.current = [...coreItems, ...vesselItems]
            setRenderItems([...coreItems, ...vesselItems])
            invalidate()
          })
          .catch((err) => console.warn('[HeartModel] Background vessels error:', err))
      })
      .catch((err) => console.error('[HeartModel] Core bundle load error:', err))

    return () => {
      active = false
    }
  }, [framesDir])

  // Clipping & Visibility Sync
  useEffect(() => {
    const planes = clipPlane ? [clipPlane] : []

    itemsRef.current.forEach(({ mesh, isVein, isArtery, isMyo }) => {
      if (mesh.material) {
        mesh.material.clippingPlanes = planes
        mesh.material.needsUpdate = true
      }
      if (isMyo) {
        mesh.visible = showEpi
      } else if (isArtery) {
        mesh.visible = showEpi && showArteries
      } else if (isVein) {
        mesh.visible = showEpi && showVeins
      } else {
        mesh.visible = true
      }
    })

    if (stencilHelperRef.current?.material) {
      stencilHelperRef.current.material.clippingPlanes = planes
      stencilHelperRef.current.material.needsUpdate = true
    }

    invalidate()
  }, [clipPlane, showEpi, showArteries, showVeins, renderItems, invalidate])

  // Stencil helper
  useEffect(() => {
    if (!hasClip || !coreLoaded) return
    const myo = myoMeshRef.current
    if (!myo || !myo.isMesh) return

    const mat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      colorWrite: false,
      depthWrite: false,
      depthTest: false,
      stencilWrite: true,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.InvertStencilOp,
      stencilZFail: THREE.InvertStencilOp,
      stencilZPass: THREE.InvertStencilOp,
      clippingPlanes: clipPlane ? [clipPlane] : [],
    })

    const helper = new THREE.Mesh(myo.geometry, mat)
    helper.renderOrder = RO_STENCIL
    helper.name = 'stencilHelper'
    myo.add(helper)
    stencilHelperRef.current = helper

    return () => {
      myo.remove(helper)
      mat.dispose()
      stencilHelperRef.current = null
    }
  }, [coreLoaded, hasClip, clipPlane])

  // Cardiac contraction loop
  useFrame((_, delta) => {
    if (!coreLoaded || (isPaused && forcedFrame === null) || itemsRef.current.length === 0) return

    const safeBpm = Number(bpm) || 60
    const dt = Math.min(delta, 0.05)
    const tCycle = 60.0 / safeBpm

    const maxSysFraction = tCycle * 0.48
    const tSysCalculated = 0.413 - 0.0017 * safeBpm
    const tSys = Math.min(Math.max(tSysCalculated, 0.18), maxSysFraction)
    const tDia = tCycle - tSys

    let ff = 0
    if (forcedFrame !== null && forcedFrame !== undefined) {
      ff = (forcedFrame / 30) * (NUM_FRAMES - 1)
    } else {
      animElapsed.current = (animElapsed.current + dt) % tCycle
      const tLocal = animElapsed.current

      if (tLocal < tSys) {
        ff = (tLocal / tSys) * ES_FRAME
      } else {
        ff = ES_FRAME + ((tLocal - tSys) / tDia) * (NUM_FRAMES - ES_FRAME)
      }
    }

    ff = Math.min(Math.max(ff, 0), NUM_FRAMES - 1)

    itemsRef.current.forEach(({ struct }) => {
      evaluateStructureFrame(struct, ff)
    })
  })

  if (!coreLoaded) return null

  return (
    <group {...props}>
      {renderItems.map(({ mesh }) => (
        <primitive key={mesh.name} object={mesh} />
      ))}
    </group>
  )
}