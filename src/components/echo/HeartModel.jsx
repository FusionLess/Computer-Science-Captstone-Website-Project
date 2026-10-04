import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { capStyle } from './SliceCap'

const NUM_FRAMES = 75
const ES_FRAME = 25
// loads all the frames path into an array and iterates over all of them

// builds the list of frame paths for a given public folder, e.g. '/frames' or '/compensated_heart'
const buildFramePaths = (dir) =>
  Array.from({ length: NUM_FRAMES }, (_, i) => `${dir}/frame_${i}.glb`)

// Render order: stencil pass (10) -> cap plane (11, see SliceCap) -> myocardium (12) -> chambers/vessels (13)
// Chambers draw AFTER the myocardium because the myo's inner cavity walls coincide with
// lv_endo / rv_endo; the later draw wins, so the chamber colours show through.
const RO_STENCIL = 10
const RO_MYO = 12
const RO_OTHER = 13

// function essentially displays only one frame at a time and only loads one frame at a time.
// all 75 frames are loaded into gpu memory but only active frame is visible
function SingleFrame({ url, isVisible, showEpi, clipPlane, capColor }) {
  const { scene: cachedScene } = useGLTF(url)
  // Echo changes clipping and adds stencil meshes; keep the shared GLTF cache intact.
  const scene = useMemo(() => {
    const clonedScene = cachedScene.clone(true)
    clonedScene.traverse((child) => {
      if (!child.isMesh) return
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone()
    })
    return clonedScene
  }, [cachedScene])

  useEffect(() => () => {
    scene.traverse((child) => {
      if (!child.isMesh) return
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => material.dispose())
    })
  }, [scene])
  const myoMeshRef = useRef(null)
  const hasClip = !!clipPlane

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || child.name === 'stencilHelper') return

      const isMyo = child.name === 'mesh0'
      if (isMyo) myoMeshRef.current = child

      if (isMyo && child.material) {
        // The cap copies the muscle's real material, unless the myocardium is painted with
        // per-vertex colours (infarct hearts): then the material colour is white, so use capColor.
        const hasVertexColors = !!child.geometry?.attributes?.color
        if (capColor) {
          capStyle.color = new THREE.Color(capColor)
        } else if (!hasVertexColors && child.material.color) {
          capStyle.color = child.material.color.clone()
        }
        capStyle.roughness = child.material.roughness ?? null
        capStyle.metalness = child.material.metalness ?? null
      }

      if (child.material) {
        child.material.side = THREE.DoubleSide
        child.material.flatShading = false
        child.material.transparent = false
        child.material.depthWrite = true

        child.renderOrder = isMyo ? RO_MYO : RO_OTHER
        child.material.polygonOffset = true
        // myo pulled toward camera, internal chambers pushed back
        child.material.polygonOffsetFactor = isMyo ? -1.0 : 1.0
        child.material.polygonOffsetUnits = isMyo ? -1.0 : 1.0
        child.material.needsUpdate = true
      }
    })

    if (!myoMeshRef.current) {
      console.warn('[HeartModel] mesh0 (myocardium) not found in', url)
    }

    // Diagnostic: the myocardium should be the largest mesh (~11k triangles in the Python log)
    if (url.endsWith('frame_0.glb')) {
      scene.traverse((c) => {
        if (c.isMesh && c.name !== 'stencilHelper') {
          const g = c.geometry
          const tris = (g.index ? g.index.count : g.attributes.position.count) / 3
          console.log('[HeartModel] frame_0 mesh:', c.name, 'triangles:', tris)
        }
      })
    }
  }, [scene, url, capColor])

  // Myocardium visibility toggle
  useEffect(() => {
    if (myoMeshRef.current) {
      myoMeshRef.current.visible = showEpi
    }
  }, [showEpi])

  // Stencil helper meshes: count back faces (+1) and front faces (-1) of the closed myo volume.
  // Pixels that end up non-zero are inside muscle. MUST be declared before the clipping effect
  // so the clipping planes also get applied to these helper materials.
  useEffect(() => {
    if (!hasClip) return
    const myo = myoMeshRef.current
    if (!myo || !myo.isMesh) return

    // Parity counting: every surface crossed flips the stencil bits, so muscle = odd, cavity = even.
    // Independent of face winding, so it works even if the cavity walls aren't inverted in the GLB.
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
    })
    const helper = new THREE.Mesh(myo.geometry, mat)
    helper.renderOrder = RO_STENCIL
    helper.name = 'stencilHelper'
    myo.add(helper) // child inherits the heart's transform

    return () => {
      myo.remove(helper)
      mat.dispose()
    }
  }, [scene, hasClip])

  // Clipping planes (applies to every mesh in the frame, including the stencil helpers)
  useEffect(() => {
    const planes = clipPlane ? [clipPlane] : []
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.clippingPlanes = planes
        child.material.needsUpdate = true
      }
    })
  }, [scene, clipPlane, hasClip])

  return <primitive object={scene} visible={isVisible} />
}

export function HeartModel({
  bpm = 60,
  showEpi = true,
  clipPlane = null,
  isPaused = false,
  forcedFrame = null,
  framesDir = '/frames',
  capColor = null,
  ...props
}) {
  const framePaths = useMemo(() => buildFramePaths(framesDir), [framesDir])
  const [activeFrame, setActiveFrame] = useState(0)
  const animElapsed = useRef(0)
  const currentFrameRef = useRef(0)

  const safeBpm = Number(bpm) || 60

  // Direct sync when external scrubbing or Cine-MRI frames drive the timeline
  useEffect(() => {
    if (forcedFrame !== null && forcedFrame !== undefined) {
      // Scale incoming 30-frame MRI time domain into 75 GLB frames
      const mapped = Math.floor((forcedFrame / 30) * NUM_FRAMES)
      const targetFrame = Math.min(Math.max(mapped, 0), NUM_FRAMES - 1)
      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame
        setActiveFrame(targetFrame)
      }
    }
  }, [forcedFrame])

  useFrame((_, delta) => {
    // stop advancing the animation timeline if paused or controlled by external forced frame
    if (isPaused || forcedFrame !== null) return

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
      // SYSTOLIC PHASE (Frames 0 -> ES_FRAME)
      const progressSys = tLocal / tSys
      targetFrame = Math.floor(progressSys * ES_FRAME)
    } else {
      // DIASTOLIC PHASE (Frames ES_FRAME -> NUM_FRAMES)
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
      {framePaths.map((path, idx) => (
        <SingleFrame
          key={path}
          url={path}
          isVisible={idx === activeFrame}
          showEpi={showEpi}
          clipPlane={clipPlane}
          capColor={capColor}
        />
      ))}
    </group>
  )
}
