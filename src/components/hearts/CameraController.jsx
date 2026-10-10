import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function CameraController({
    resetTrigger,
    initialPos = [-225, -20, -200] ,
    preset = "frontal",
    syncEnabled = false,
    syncedCameraRef,
    index
}) {
    const { camera } = useThree()
    const controlsRef = useRef(null)
    const isInteractingRef = useRef(false)

    const targetPos = useRef(new THREE.Vector3())
    const targetTarget = useRef(new THREE.Vector3())

    const animatingRef = useRef(false)
    const startTimeRef = useRef(0)
    const DURATION = 0.8 // Duration in seconds

    const startPos = useRef(new THREE.Vector3())
    const endPos = useMemo(() => new THREE.Vector3(...initialPos), [initialPos])
    const startTarget = useRef(new THREE.Vector3())
    const endTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])
    const startUp = useRef(new THREE.Vector3())
    const endUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])

    useEffect(() => {
        if (!syncEnabled) {
            if (syncedCameraRef) syncedCameraRef.current = null
            return
        }

        if (index === 0 && controlsRef.current && syncedCameraRef) {
            syncedCameraRef.current = {
                position: camera.position.toArray(),
                target: controlsRef.current.target.toArray(),
                zoom: camera.zoom,
            }
        }
    }, [syncEnabled, index, camera, syncedCameraRef])

    useEffect(() => {
        if (resetTrigger === 0 || !controlsRef.current) return

        startPos.current.copy(camera.position)
        startTarget.current.copy(controlsRef.current.target)
        startUp.current.copy(camera.up)

        startTimeRef.current = performance.now()
        animatingRef.current = true
    }, [resetTrigger, camera, initialPos, preset])

    useFrame(() => {
        if (!controlsRef.current) return

        if (animatingRef.current) {
            const elapsed = (performance.now() - startTimeRef.current) / 1000
            const rawT = Math.min(elapsed / DURATION, 1.0)
            const t = 1.0 - Math.pow(1.0 - rawT, 3)

            camera.position.lerpVectors(startPos.current, endPos, t)
            camera.up.lerpVectors(startUp.current, endUp, t).normalize()
            controlsRef.current.target.lerpVectors(startTarget.current, endTarget, t)

            camera.lookAt(controlsRef.current.target)
            controlsRef.current.update()

            if (rawT >= 1.0) {
                animatingRef.current = false
                controlsRef.current.saveState()

                if (syncEnabled && syncedCameraRef) {
                    syncedCameraRef.current = {
                        position: camera.position.toArray(),
                        target: controlsRef.current.target.toArray(),
                        zoom: camera.zoom,
                    }
                }
            }
            return
        }


        if (syncEnabled && syncedCameraRef?.current && !isInteractingRef.current) {
            const { position, target, zoom } = syncedCameraRef.current

            targetPos.current.set(...position)
            targetTarget.current.set(...target)

            // Lerp smoothly at 0.3 factor
            camera.position.lerp(targetPos.current, 0.3)
            controlsRef.current.target.lerp(targetTarget.current, 0.3)

            if (Math.abs(camera.zoom - zoom) > 0.0001) {
                camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoom, 0.3)
                camera.updateProjectionMatrix()
            }
            controlsRef.current.update()
        }
    })

    const handleControlsChange = () => {
        if (!syncEnabled || !isInteractingRef.current || !controlsRef.current || !syncedCameraRef) return

        syncedCameraRef.current = {
            position: camera.position.toArray(),
            target: controlsRef.current.target.toArray(),
            zoom: camera.zoom,
        }
    }

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={160}
            maxDistance={480}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            onChange={handleControlsChange}
            onStart={() => { isInteractingRef.current = true }}
            onEnd={() => { isInteractingRef.current = false }}
        />
    )
}