import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { loadCoreBundle, loadVesselsBundle, evaluateStructureFrame } from './heartPackDecode'
import { phaseToFrame } from './heartRendering'
import { HeartParts } from '../../data/HeartParts'

const NUM_FRAMES = 75
const ES_FRAME = 25

const RO_STENCIL = 10
const RO_MYO = 12
const RO_OTHER = 13
const RO_VESSELS = 14

export function HeartModel({
  frameFolder = 'frames',
  bpm = 60,
  showEpi = true,
  showVeins = true,
  showArteries = true,
  ventricleOnly = false,
  clipPlane = null,
  isPaused = false,
  animationPhase = undefined,
  capStyleRef,
  capColor = null,
  beatInterval,
  getAnimationTime,
  onHover,
  onSelect,
  onLoaded,
  ...props
}) {
  const [coreLoaded, setCoreLoaded] = useState(false)
  const [renderItems, setRenderItems] = useState([])
  const itemsRef = useRef([])
  const myoMeshRef = useRef(null)
  const stencilHelperRef = useRef(null)
  const centerOffsetRef = useRef(new THREE.Vector3())
  const pressRef = useRef(null)

  const totalElapsed = useRef(0)
  const currentFrameRef = useRef(0)
  const hasClip = !!clipPlane
  const { invalidate } = useThree()

  // Format folder URL
  const folderUrl = useMemo(() => {
    return frameFolder.startsWith('/') ? frameFolder : `/${frameFolder}`
  }, [frameFolder])

  // Clear pointer interactions
  useEffect(() => {
    const clearPress = () => { pressRef.current = null }
    window.addEventListener('pointerup', clearPress)
    window.addEventListener('pointercancel', clearPress)
    return () => {
      window.removeEventListener('pointerup', clearPress)
      window.removeEventListener('pointercancel', clearPress)
    }
  }, [])

  // Material and Mesh Factory
  const createMeshItem = (s, idx) => {
    const rawName = s.name || `mesh_${idx}`
    const nameLower = rawName.toLowerCase()
    const isMyo = nameLower === 'myo' || nameLower === 'mesh0' || idx === 0
    const isVein = s.bundle === 'vessels' && (nameLower.includes('vein') || rawName === 'mesh1_vessel')
    const isArtery = s.bundle === 'vessels' && !isVein
    const isLV = nameLower.includes('lv') || rawName === 'mesh4'
    const hasVertexColors = !!s.geometry.attributes.color

    let mat
    if (isMyo) {
      mat = new THREE.MeshStandardMaterial({
        color: hasVertexColors ? new THREE.Color('#ffffff') : new THREE.Color('#B01E28'),
        vertexColors: hasVertexColors,
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.FrontSide, // FrontSide only: prevents the myocardium's inside cavity wall from colliding with endo
        depthWrite: true,
      })
      mat.polygonOffset = true
      // Push myocardium SLIGHTLY BACKWARDS in the depth buffer
      mat.polygonOffsetFactor = 1.0
      mat.polygonOffsetUnits = 1.0
    } else if (s.bundle === 'vessels') {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(isVein ? '#2b4cb3' : '#d83a3a'),
        roughness: 0.35,
        metalness: 0.05,
        side: THREE.FrontSide,
        depthWrite: true,
      })
      mat.polygonOffset = false
    } else {
      // Internal Cavities (rv_endo, lv_endo, atria, aorta, pa)
      let chamberColor = new THREE.Color('#ffffff')
      if (isLV) chamberColor = new THREE.Color('#d90429')
      else if (nameLower.includes('rv') || rawName === 'mesh1') chamberColor = new THREE.Color('#0077b6')
      else if (nameLower.includes('la') || rawName === 'mesh5') chamberColor = new THREE.Color('#ef233c')
      else if (nameLower.includes('ra') || rawName === 'mesh2') chamberColor = new THREE.Color('#0096c7')
      else if (nameLower.includes('aorta') || rawName === 'mesh6') chamberColor = new THREE.Color('#9b2226')
      else if (nameLower.includes('pulmonary') || rawName === 'mesh3') chamberColor = new THREE.Color('#023e8a')
      else if (s.material?.color) {
        chamberColor = new THREE.Color(s.material.color[0], s.material.color[1], s.material.color[2])
      }

      mat = new THREE.MeshStandardMaterial({
        color: hasVertexColors ? new THREE.Color('#ffffff') : chamberColor,
        vertexColors: hasVertexColors,
        roughness: s.material?.roughness ?? 0.5,
        metalness: s.material?.metalness ?? 0.05,
        side: THREE.DoubleSide,
        depthWrite: true,
      })
      mat.polygonOffset = true
      // Pull internal cavity lining FORWARD in the depth buffer so it always wins over myocardium
      mat.polygonOffsetFactor = -2.0
      mat.polygonOffsetUnits = -2.0
    }

    const mesh = new THREE.Mesh(s.geometry, mat)
    mesh.name = isVein ? 'coronaryVeins' : isArtery ? 'coronaryArteries' : rawName
    mesh.userData.originalName = rawName
    mesh.userData.isCoronaryVessel = s.bundle === 'vessels'
    mesh.renderOrder = isMyo ? RO_MYO : s.bundle === 'vessels' ? RO_VESSELS : RO_OTHER

    if (isMyo && !myoMeshRef.current) {
      myoMeshRef.current = mesh
    }

    return { struct: s, mesh, isVein, isArtery, isMyo }
  }

  // Core Geometry; Lazy Vessels
  useEffect(() => {
    let active = true
    setCoreLoaded(false)
    myoMeshRef.current = null

    loadCoreBundle(folderUrl)
      .then(({ manifest, totalFrames, structures }) => {
        if (!active) return

        const masterBox = new THREE.Box3()
        structures.forEach((s) => {
          evaluateStructureFrame(s, 0.0)
          s.geometry.computeBoundingBox()
          if (s.geometry.boundingBox) masterBox.union(s.geometry.boundingBox)
        })

        const centerOffset = new THREE.Vector3()
        masterBox.getCenter(centerOffset)
        centerOffsetRef.current.copy(centerOffset)

        structures.forEach((s) => {
          s.geometry.translate(-centerOffset.x, -centerOffset.y, -centerOffset.z)
          for (let i = 0; i < s.basePositions.length; i += 3) {
            s.basePositions[i + 0] -= centerOffset.x
            s.basePositions[i + 1] -= centerOffset.y
            s.basePositions[i + 2] -= centerOffset.z
          }

          // Expand endocardium outward to seal the boundary gap against the cut rim
          const nameLower = (s.name || '').toLowerCase()
          if (nameLower.includes('endo') || nameLower === 'mesh1' || nameLower === 'mesh4') {
            s.geometry.computeVertexNormals()
            const normals = s.geometry.attributes.normal.array
            const pos = s.geometry.attributes.position.array
            const DILATE = 1.0

            for (let i = 0; i < pos.length; i += 3) {
              pos[i + 0] += normals[i + 0] * DILATE
              pos[i + 1] += normals[i + 1] * DILATE
              pos[i + 2] += normals[i + 2] * DILATE

              s.basePositions[i + 0] += normals[i + 0] * DILATE
              s.basePositions[i + 1] += normals[i + 1] * DILATE
              s.basePositions[i + 2] += normals[i + 2] * DILATE
            }
            s.geometry.attributes.position.needsUpdate = true
          }

          s.geometry.computeBoundingBox()
        })

        const coreItems = structures.map((s, idx) => createMeshItem(s, idx))
        itemsRef.current = coreItems
        setRenderItems([...coreItems])
        setCoreLoaded(true)
        invalidate()

        loadVesselsBundle(folderUrl, manifest, totalFrames)
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

            const vesselItems = vesselStructures.map((s, idx) =>
              createMeshItem(s, coreItems.length + idx)
            )
            itemsRef.current = [...coreItems, ...vesselItems]
            setRenderItems([...coreItems, ...vesselItems])
            onLoaded?.()
            invalidate()
          })
          .catch((err) => console.warn('[HeartModel] Lazy vessels error:', err))
      })
      .catch((err) => console.error('[HeartModel] Core pack load error:', err))

    return () => {
      active = false
    }
  }, [folderUrl])

  // sync clipping, visibility and ventricle isolation
  useEffect(() => {
    const planes = clipPlane ? [clipPlane] : []

    itemsRef.current.forEach(({ mesh, isVein, isArtery, isMyo }) => {
      if (mesh.material) {
        mesh.material.clippingPlanes = planes
        mesh.material.needsUpdate = true
      }

      const origName = mesh.userData.originalName || mesh.name

      let isVisible = true

      if (mesh.userData.isCoronaryVessel) {
        const showVessel = isVein ? showVeins : showArteries
        isVisible = showVessel && showEpi && !ventricleOnly
      } else if (isMyo) {
        isVisible = showEpi
      } else {
        const isVentricle = origName === 'rv_endo' || origName === 'lv_endo'
        isVisible = !ventricleOnly || isVentricle
      }

      mesh.visible = isVisible
      // Disable raycasting when hidden so it never catches pointer events
      mesh.raycast = isVisible ? THREE.Mesh.prototype.raycast : () => { }
    })

    if (stencilHelperRef.current?.material) {
      stencilHelperRef.current.material.clippingPlanes = planes
      stencilHelperRef.current.material.needsUpdate = true
    }

    // dynamic slice cap styling
    if (capStyleRef) {
      capStyleRef.current = {
        color: capColor ? new THREE.Color(capColor) : new THREE.Color('#B01E28'),
        roughness: 0.55,
        metalness: 0.05,
      }
    }

    invalidate()
  }, [clipPlane, showEpi, showArteries, showVeins, ventricleOnly, renderItems, capColor, capStyleRef, invalidate])

  // stencil cross section helper for solid cut planes
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

  // pointer and anatomical tooltip resolver
  const getSelectedMesh = (event) => {
    if (showEpi && !clipPlane) {
      return event.object
    }

    const chamberHit = event.intersections?.find((hit) => {
      const name = (hit.object.userData.originalName || hit.object.name || '').toLowerCase()
      return hit.object.visible && name !== 'myo' && name !== 'mesh0' && name !== 'stencilhelper'
    })

    return chamberHit?.object ?? event.object
  }

  // animation and morph evaluation loop
  useFrame((_, delta) => {
    if (!coreLoaded || itemsRef.current.length === 0) return

    let targetFrameFloat = 0

    if (animationPhase !== undefined) {
      targetFrameFloat = phaseToFrame(animationPhase)
    } else if (isPaused || bpm <= 0) {
      targetFrameFloat = currentFrameRef.current
    } else {
      const dt = Math.min(delta, 0.05)
      if (!getAnimationTime) {
        totalElapsed.current += dt
        beatInterval?.(totalElapsed.current)
      }
      // Both viewers use the same elapsed time with the original frame mapping.
      const elapsed = getAnimationTime?.() ?? totalElapsed.current
      const safeBpm = Number(bpm) || 60
      const tCycle = 60 / safeBpm
      const tSys = Math.min(Math.max(0.413 - 0.0017 * safeBpm, 0.18), tCycle * 0.48)
      const CONTRACTION_PHASE_OFFSET = 0.35
      const tLocal = ((elapsed / tCycle - CONTRACTION_PHASE_OFFSET + 1) % 1) * tCycle

      targetFrameFloat = tLocal < tSys
        ? (tLocal / tSys) * ES_FRAME
        : ES_FRAME + ((tLocal - tSys) / (tCycle - tSys)) * (NUM_FRAMES - ES_FRAME)
    }

    targetFrameFloat = Math.min(Math.max(targetFrameFloat, 0), NUM_FRAMES - 1)
    currentFrameRef.current = targetFrameFloat

    itemsRef.current.forEach(({ struct }) => {
      evaluateStructureFrame(struct, targetFrameFloat)
    })
  })

  if (!coreLoaded) return null

  return (
    <group {...props}>
      {renderItems.map(({ mesh }) => (
        <primitive
          key={mesh.name}
          object={mesh}
          onPointerMove={(event) => {
            if (pressRef.current || event.pointerType !== 'mouse') return
            const selected = getSelectedMesh(event)
            event.stopPropagation()
            const displayName = HeartParts[selected.name]?.name || selected.name
            onHover?.({
              name: displayName,
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
            if (event.button !== 0) return
            pressRef.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
            }
            onHover?.(null)
          }}
          onPointerUp={(event) => {
            const press = pressRef.current
            pressRef.current = null
            if (!press || press.pointerId !== event.pointerId) return
            event.stopPropagation()
            if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) return
            const selected = getSelectedMesh(event)
            onSelect?.(selected.name)
          }}
          onPointerCancel={() => {
            pressRef.current = null
          }}
        />
      ))}
    </group>
  )
}
