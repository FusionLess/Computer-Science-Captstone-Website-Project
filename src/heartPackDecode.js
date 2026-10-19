import * as THREE from 'three'

export function decodeStructures(manifest, buf, bundleName, totalFrames) {
  const structures = []
  const manifestStructs = manifest.structures.filter((s) => s.bundle === bundleName)

  for (const s of manifestStructs) {
    const N = s.vertexCount
    const K = s.k ?? 12

    // 1. Exact Mean Range & Span
    const rangeSource = s.meanRange || s.bbox
    const minP = rangeSource.min
    const maxP = rangeSource.max
    const spanP = [
      maxP[0] - minP[0],
      maxP[1] - minP[1],
      maxP[2] - minP[2],
    ]

    // 2. Decode Positions
    const qMeanP = new Uint16Array(buf, s.meanPos.offset, 3 * N)
    const basePositions = new Float32Array(3 * N)

    for (let i = 0; i < N; i++) {
      basePositions[3 * i + 0] = minP[0] + (qMeanP[3 * i + 0] / 65535.0) * spanP[0]
      basePositions[3 * i + 1] = minP[1] + (qMeanP[3 * i + 1] / 65535.0) * spanP[1]
      basePositions[3 * i + 2] = minP[2] + (qMeanP[3 * i + 2] / 65535.0) * spanP[2]
    }

    // 3. Triangle indices
    const indexCount = s.indices?.count ?? (s.triangleCount ? s.triangleCount * 3 : (s.indices?.triangleCount ? s.indices.triangleCount * 3 : N * 3))
    const isUint16 = N < 65535
    const indices = isUint16
      ? new Uint16Array(buf, s.indices.offset, indexCount)
      : new Uint32Array(buf, s.indices.offset, indexCount)

    // 4. Mode positions
    let modesP = null
    if (K > 0 && s.modePos) {
      const qModesP = new Int16Array(buf, s.modePos.offset, K * 3 * N)
      modesP = new Float32Array(K * 3 * N)
      const scales = s.modePos.scales || []
      for (let k = 0; k < K; k++) {
        const scale = scales[k] ?? 1.0
        const off = k * 3 * N
        for (let j = 0; j < 3 * N; j++) {
          modesP[off + j] = qModesP[off + j] * scale
        }
      }
    }

    // 5. Binary Animation Coefficients
    let weightsP = null
    if (s.coeffs?.offset !== undefined) {
      const frames = s.coeffs.frames ?? totalFrames
      weightsP = new Float32Array(buf, s.coeffs.offset, frames * K)
    }

    // 6. Geometry
    const geometry = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(new Float32Array(basePositions), 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('position', posAttr)
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    geometry.computeVertexNormals()

    structures.push({
      name: s.name,
      bundle: s.bundle,
      geometry,
      basePositions,
      modesP,
      weightsP,
      vertexCount: N,
      modeCount: K,
      material: s.material || {},
    })
  }

  return structures
}

export async function loadCoreBundle(folderUrl) {
  const manifest = await fetch(`${folderUrl}/heart.json`).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch heart.json: ${r.status}`)
    return r.json()
  })

  const coreBuffer = await fetch(`${folderUrl}/core.bin`).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch core.bin: ${r.status}`)
    return r.arrayBuffer()
  })

  const totalFrames = manifest.frames || 75
  const structures = decodeStructures(manifest, coreBuffer, 'core', totalFrames)

  return {
    manifest,
    totalFrames,
    structures,
  }
}

export async function loadVesselsBundle(folderUrl, manifest, totalFrames) {
  const vesselsBuffer = await fetch(`${folderUrl}/vessels.bin`).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch vessels.bin: ${r.status}`)
    return r.arrayBuffer()
  })

  return decodeStructures(manifest, vesselsBuffer, 'vessels', totalFrames)
}

export function evaluateStructureFrame(struct, frameFloat) {
  const { geometry, basePositions, modesP, weightsP, vertexCount, modeCount } = struct
  if (!modesP || modeCount === 0 || !weightsP || weightsP.length === 0) return

  const totalFrames = Math.floor(weightsP.length / modeCount)
  const safeFrame = ((frameFloat % totalFrames) + totalFrames) % totalFrames
  const f0 = Math.floor(safeFrame)
  const f1 = (f0 + 1) % totalFrames
  const alpha = safeFrame - f0

  const posArr = geometry.attributes.position.array
  posArr.set(basePositions)

  for (let k = 0; k < modeCount; k++) {
    const w0 = weightsP[f0 * modeCount + k]
    const w1 = weightsP[f1 * modeCount + k]
    const cP = w0 + alpha * (w1 - w0)

    const off = k * 3 * vertexCount
    for (let j = 0; j < 3 * vertexCount; j++) {
      posArr[j] += cP * modesP[off + j]
    }
  }

  geometry.attributes.position.needsUpdate = true
}