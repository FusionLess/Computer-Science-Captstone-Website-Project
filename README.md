# 3D Cardiac cycle web viewer

This is the documentation for implementation of the web-based cardiac visualisation tool built with **React Three Fiber**, **Three,js**, and **PyVista**. This tool renders all 25 frames with some hardware acceleration for rendering and a clipping plane that lets you see into the heart with different anatomical structure toggles. It also features variable heart rate slider (although very crude as of the writing of this documentation) as well as a pause button (WOW).

---
## Architecture Overview
1. **Python export pipeline (not available in this repo)**
    - Essentially turns the .npz files provided by Stephen Creamer's team into '.glb' files that can be used in the web. If necessary, I can upload all that and document it here.

2. **Frontend Render Engine (the meat and potatoes)**
    - **Playback engine** runs a gpu accelerated frame-swapping mechanism inside @react-three/fiber`'s `useFrame` loop. The cardiac timeline is driven dynamically by a beats-per-minute (BPM) formula without heavy CPU mesh transformations.
    - **GPU Hardware Clipping:** Implements `THREE.Plane` calculations directly in fragment shaders, enabling arbitrary oblique cutaways with zero geometry degradation.
    - **Double-Sided Rendering:** Meshes leverage `THREE.DoubleSide` and `logarithmicDepthBuffer` to prevent internal cavity culling and z-fighting during slice operations.

# Getting Started
## Prerequisties
- Node.js (v18+)
- Python 3.9+ with pyvista, numpy, and trimesh (only necessary if the mesh generation code is here)

## Frontend Installation and Development
Install dependencies and launch the local Vite development server

```Bash  
npm install
npm install three @react-three/fiber @react-three/drei
npm install -D vite @vitejs/plugin-react
npm run dev 
```
# Component API Reference
### `<HeartModel />`
#### Properties

| Prop        | Type                                 | Default     | Description                                                                                               |
| :---------- | :----------------------------------- | :---------- | :-------------------------------------------------------------------------------------------------------- |
| `bpm`       | `number`                             | `60`        | Playback speed in beats per minute. Dynamically scales the frame interval duration (`(60.0 / bpm) / 25`). |
| `isPaused`  | `boolean`                            | `false`     | When `true`, freezes frame timeline accumulation in `useFrame`, holding the active frame static.          |
| `showEpi`   | `boolean`                            | `true`      | Toggles visibility of the epicardium outer wall (`mesh0`). When `false`, exposes the internal chambers.   |
| `clipPlane` | `THREE.Plane \| null`                | `null`      | Active clipping plane instance passed to all sub-mesh materials for GPU-accelerated slicing.              |
| `rotation`  | `[number, number, number]`           | `[0, 0, 0]` | Euler rotation array in radians applied to the root heart model group.                                    |
| `position`  | `[number, number, number]`           | `[0, 0, 0]` | World position coordinates for the model root.                                                            |
| `scale`     | `number \| [number, number, number]` | `1`         | Scale factor applied to the root model group.                                                             |

---

### `<SingleFrame />` (Internal)

Sub-component instantiated 75 times by `<HeartModel />`. Preloads, parses, and manages material configuration for an individual GLB frame file.
#### Properties

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | Yes | Path to the exported frame asset (e.g., `/frames/frame_0.glb`). |
| `isVisible` | `boolean` | Yes | Controls whether this specific frame mesh is rendered in the current animation tick. |
| `showEpi` | `boolean` | Yes | Controls mesh visibility specifically for `mesh0` (epicardium). |
| `clipPlane` | `THREE.Plane \| null` | No | Clipping plane assigned to the `material.clippingPlanes` array. |

#### Material Configuration Defaults
- `material.side`: `THREE.DoubleSide` (enables hollow interior cavity rendering during cross-sections)
- `material.clipShadows`: `true`
- `material.needsUpdate`: `true` (triggered dynamic ally on clipping plane change)



