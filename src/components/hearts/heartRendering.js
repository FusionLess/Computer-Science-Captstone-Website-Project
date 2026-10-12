import * as THREE from 'three'

export const HEART_FRAME_COUNT = 75
export const phaseToFrame = (phase) => Math.min(
  Math.max(Math.floor(phase * HEART_FRAME_COUNT + 1e-9), 0),
  HEART_FRAME_COUNT - 1
)

export const materialsOf = (mesh) => Array.isArray(mesh.material)
  ? mesh.material
  : [mesh.material]

export const isMuscle = (mesh) => mesh.name === 'mesh0' || mesh.name.toLowerCase().includes('epi')

export function cloneHeartScene(scene) {
  const model = scene.clone(true)
  model.traverse((child) => {
    if (!child.isMesh) return
    child.material = Array.isArray(child.material)
      ? child.material.map((material) => material.clone())
      : child.material.clone()
    const originalRaycast = child.raycast
    child.raycast = function (raycaster, intersections) {
      for (let ancestor = this; ancestor; ancestor = ancestor.parent) {
        if (!ancestor.visible) return
      }

      const hits = []
      originalRaycast.call(this, raycaster, hits)

      for (const hit of hits) {
        const material = Array.isArray(this.material)
            ? this.material[hit.face?.materialIndex ?? 0]
            : this.material

        const planes = material?.clippingPlanes ?? []
        const isClipped = planes.some(
            plane => plane.distanceToPoint(hit.point) < 0
        )

        if (!isClipped) intersections.push(hit)
      }
    }
  })
  return model
}

export function addStencilHelpers(model, clipPlane) {
  const muscles = []
  model.traverse((child) => {
    if (child.isMesh && isMuscle(child)) muscles.push(child)
  })
  const helpers = muscles.map((muscle) => {
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      colorWrite: false,
      depthWrite: false,
      depthTest: false,
      stencilWrite: true,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.InvertStencilOp,
      stencilZFail: THREE.InvertStencilOp,
      stencilZPass: THREE.InvertStencilOp,
      clippingPlanes: [clipPlane],
    })
    const helper = new THREE.Mesh(muscle.geometry, material)
    helper.name = 'stencilHelper'
    helper.renderOrder = 10
    helper.raycast = () => {}
    muscle.updateMatrix()
    helper.matrix.copy(muscle.matrix)
    helper.matrixAutoUpdate = false
    // A sibling keeps drawing the cut even when the muscle itself is hidden.
    muscle.parent.add(helper)
    helper.layers.set(1)
    return helper
  })
  return () => {
    helpers.forEach((helper) => {
      helper.removeFromParent()
      helper.material.dispose()
    })
  }
}
