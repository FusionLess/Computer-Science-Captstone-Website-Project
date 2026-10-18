import {test} from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import {
    HEART_FRAME_COUNT, phaseToFrame, cloneHeartScene, addStencilHelpers,
} from '../src/components/hearts/heartRendering.js'

test('manual scrubbing stays inside the available frames, including endpoints', () => {
    assert.equal(phaseToFrame(-1), 0)
    assert.equal(phaseToFrame(0), 0)
    assert.equal(phaseToFrame(0.5), 37)
    assert.equal(phaseToFrame(1), HEART_FRAME_COUNT - 1)
    assert.equal(phaseToFrame(2), HEART_FRAME_COUNT - 1)
    for (let frame = 0; frame < HEART_FRAME_COUNT; frame++) {
        assert.equal(phaseToFrame(frame / HEART_FRAME_COUNT), frame)
    }
})

function makeScene(multipleMaterials = false) {
    const scene = new THREE.Group()
    const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide})
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), multipleMaterials
        ? Array.from({length: 6}, () => material.clone()) : material)
    mesh.name = 'mesh0'
    scene.add(mesh)
    return scene
}

function pick(model, x = 0) {
    model.updateMatrixWorld(true)
    return new THREE.Raycaster(
        new THREE.Vector3(x, 0, 2), new THREE.Vector3(0, 0, -1),
    ).intersectObject(model, true)
}

for (const multiple of [false, true]) {
    test(`frame clones isolate ${multiple ? 'multiple materials' : 'materials'} while sharing geometry`, () => {
        const original = makeScene(multiple)
        const first = cloneHeartScene(original).children[0]
        const second = cloneHeartScene(original).children[0]
        const materials = mesh => Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        assert.equal(first.geometry, original.children[0].geometry)
        materials(first).forEach((material, index) => {
            assert.notEqual(material, materials(original.children[0])[index])
            assert.notEqual(material, materials(second)[index])
            material.color.set('red')
            assert.equal(materials(second)[index].color.getHex(), 0xffffff)
        })
    })
}

test('ray picking ignores hidden frames and hidden ancestor groups', () => {
    const model = cloneHeartScene(makeScene())
    assert.ok(pick(model).length > 0)
    model.children[0].visible = false
    assert.equal(pick(model).length, 0)
    model.children[0].visible = true
    const parent = new THREE.Group()
    parent.add(model)
    parent.visible = false
    assert.equal(pick(parent).length, 0)
    parent.visible = true
    assert.ok(pick(parent).length > 0)
})

for (const multiple of [false, true]) {
    test(`clipped surfaces cannot be selected (${multiple ? 'multiple' : 'single'} material)`, () => {
        const model = cloneHeartScene(makeScene(multiple))
        const mesh = model.children[0]
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        materials.forEach(material => {
            material.clippingPlanes = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)]
        })
        assert.equal(pick(model, -0.25).length, 0)
        assert.ok(pick(model, 0.25).length > 0)
        assert.ok(pick(model, 0).length > 0, 'points on the clipping plane remain selectable')
    })
}

test('stencil helpers preserve muscle transforms and clean up without disposing shared geometry', () => {
    const model = makeScene()
    const muscle = model.children[0]
    muscle.position.set(1, 2, 3)
    const chamber = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
    chamber.name = 'mesh1'
    model.add(chamber)
    const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)
    let geometryDisposed = false
    muscle.geometry.addEventListener('dispose', () => {
        geometryDisposed = true
    })
    const cleanup = addStencilHelpers(model, plane)
    const helpers = model.children.filter(child => child.name === 'stencilHelper')
    assert.equal(helpers.length, 1, 'chambers should not receive muscle stencil helpers')
    const helper = helpers[0]
    assert.equal(helper.geometry, muscle.geometry)
    assert.ok(helper.matrix.equals(muscle.matrix))
    assert.equal(helper.material.clippingPlanes[0], plane)
    assert.equal(helper.material.colorWrite, false)
    assert.equal(helper.material.stencilWrite, true)
    const hits = []
    helper.raycast(new THREE.Raycaster(), hits)
    assert.equal(hits.length, 0)
    let materialDisposed = false
    helper.material.addEventListener('dispose', () => {
        materialDisposed = true
    })
    cleanup()
    assert.equal(helper.parent, null)
    assert.equal(materialDisposed, true)
    assert.equal(geometryDisposed, false)
    assert.ok(model.children.includes(muscle))
    assert.ok(model.children.includes(chamber))
})
