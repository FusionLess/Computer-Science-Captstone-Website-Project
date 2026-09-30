import React, { Suspense, useState, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Center, ContactShadows } from '@react-three/drei'

import { HeartModel } from './HeartModel.jsx'
import { SlicePlaneHelper } from './SlicePlaneHelper.jsx'
import CameraController from './CameraController.jsx'
import ViewerControls from './ViewerControls.jsx'
import SliceControls from './SliceControls.jsx'

import { HeartParts } from '../../data/HeartParts.ts'
import { useHeartMonitor } from "../context/HeartMonitorContext.tsx"
import HeartController from './HeartController'

// const INITIAL_CAMERA_POS = [-225, -20, -200]
const CAMERA_POSITIONS = {
    frontal: [-225, -20, -200],
    shortAxis: [-180, 150, -220]
}

export default function HeartViewer({
    frameFolder,
    setSelectedPart,
    title,
    syncEnabled,
    syncedCameraRef,
    index,
    sharedResetTrigger,
    setSharedResetTrigger,
}) {
    const defaultPreset =
        frameFolder === "compensated_heart" ||
            frameFolder === "decompensated_heart"
            ? "frontal"
            : "shortAxis"

    const initialCameraPos = CAMERA_POSITIONS[defaultPreset]
    const isDefaultShortAxis = defaultPreset === "shortAxis"
    const [resetTrigger, setResetTrigger] = useState(0)

    const { bpm, setBpm, isPaused, setIsPaused, beatInterval } = useHeartMonitor()
    const [showEpi, setShowEpi] = useState(true)
    const [ventricleOnly, setVentricleOnly] = useState(false)
    const [fullView, setFullView] = useState(false)

    // sets the preset states you can slice the heart
    const [sliceEnabled, setSliceEnabled] = useState(false)
    const [sliceControlEnabled, setSliceControlEnabled] = useState(false)
    const [showPlaneGuide, setShowPlaneGuide] = useState(true)
    const [pitch, setPitch] = useState(isDefaultShortAxis ? -90 : 0)
    const [yaw, setYaw] = useState(isDefaultShortAxis ? 0 : 4)
    const [sliceDistance, setSliceDistance] = useState(isDefaultShortAxis ? -18 : 0)

    useEffect(() => {
        const shortAxis = defaultPreset === "shortAxis"

        setFullView(false)

        setSliceEnabled(true)
        setShowPlaneGuide(true)
        setActivePreset(defaultPreset)

        if (shortAxis) {
            setPitch(-90)
            setYaw(0)
            setSliceDistance(-18)
        } else {
            setPitch(0)
            setYaw(40)
            setSliceDistance(0)
        }

        setResetTrigger(prev => prev + 1)
    }, [frameFolder])

    // sets the preset independent depth slices per selection
    const [activePreset, setActivePreset] = useState(defaultPreset)
    const [presetDepths, setPresetDepths] = useState({
        frontal: 0,
        sagittal: -3,
        shortAxis: -18,
    })

    const isInitialMount = useRef(true)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        if (syncEnabled) {
            setResetTrigger((prev) => prev + 1)
        }
    }, [sharedResetTrigger])

    const handleFullView = () => {
        if (!fullView) {
            // Enter Full View
            setFullView(true)
            setVentricleOnly(false)
            setShowEpi(true)

            setSliceEnabled(false)
            setShowPlaneGuide(false)
            setActivePreset(defaultPreset)

        } else {
            const shortAxis = defaultPreset === "shortAxis"
            setFullView(false)

            setSliceEnabled(true)
            setShowPlaneGuide(true)
            setActivePreset(defaultPreset)

            if (shortAxis) {
                setPitch(-90)
                setYaw(0)
                setSliceDistance(-18)
            } else {
                setPitch(0)
                setYaw(40)
                setSliceDistance(0)
            }
        }
    }

    const handleResetView = () => {
        const shortAxis = defaultPreset === "shortAxis"
        setFullView(false)
        setVentricleOnly(false)
        setShowEpi(true)
        // Restore predetermined slicing
        setSliceEnabled(true)
        setShowPlaneGuide(true)
        setActivePreset(defaultPreset)

        if (shortAxis) {
            setPitch(-90)
            setYaw(0)
            setSliceDistance(-18)
        } else {
            setPitch(0)
            setYaw(40)
            setSliceDistance(0)
        }
        if (syncEnabled && setSharedResetTrigger) {
            setSharedResetTrigger((prev) => prev + 1)
        } else {
            setResetTrigger((prev) => prev + 1)
        }
    }
    const handleVentricleView = () => {
        const next = !ventricleOnly
        setVentricleOnly(next)

        if (next && activePreset === "shortAxis") {
            // but move to a useful ventricular depth
            setPitch(-90)
            setYaw(0)
            setSliceDistance(-12)
        }
    }
    // tidies up the onClick part of the button to set the preset values of each slicing view
    const handlePresetSelect = (presetKey, p, y) => {
        setActivePreset(presetKey)
        setPitch(p)
        setYaw(y)
        setSliceDistance(presetDepths[presetKey])
    }

    const handleDepthSliderChange = (newDepth) => {
        setSliceDistance(newDepth)
        if (activePreset) {
            setPresetDepths((prev) => ({
                ...prev,
                [activePreset]: newDepth,
            }))
        }
    }
    const [hoverInfo, setHoverInfo] = useState(null)

    // compute arbitrary 3d normal vector from pitch and yaw
    const clipPlane = useMemo(() => {
        if (!sliceEnabled) return null

        const radPitch = THREE.MathUtils.degToRad(pitch)
        const radYaw = THREE.MathUtils.degToRad(yaw)

        // some math bs to calc (short for calculate) spherical coords normal
        const normal = new THREE.Vector3(
            Math.cos(radPitch) * Math.sin(radYaw),
            Math.sin(radPitch),
            Math.cos(radPitch) * Math.cos(radYaw)
        ).normalize()

        // slices everything on the side the normal points towards
        return new THREE.Plane(normal, sliceDistance)
    }, [sliceEnabled, pitch, yaw, sliceDistance])

    return (
      
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--background-colour)' }}>
             {title && (
                <h3
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        margin: 0,
                        zIndex: 10,
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {title}
                </h3>
            )}
            <Canvas
                camera={{ position: initialCameraPos, fov: 45 }}
                gl={{
                    logarithmicDepthBuffer: true,
                    antialias: true,
                    localClippingEnabled: true,
                }}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[300, 300, 350]} intensity={1.2} />
                <directionalLight position={[-250, -250, 200]} intensity={0.6} />

                <Suspense fallback={null}>
                    <Center position={[0,15,0]}>
                            <HeartModel
                            frameFolder={frameFolder}
                            bpm={bpm} // exposes the options for the heart model in the viewer such as the options listed below
                            showEpi={showEpi}
                            ventricleOnly={ventricleOnly}
                            clipPlane={clipPlane}
                            isPaused={isPaused}
                            rotation={[-Math.PI / 12, -Math.PI / 3, 0]} // tweaks the pitch and yaw of the heart in the viewer
                            onSelect={setSelectedPart}
                            onHover={setHoverInfo}
                            
                            beatInterval={beatInterval}
                        />
                    </Center>

                    {/* Soft contact floor shadow */}
                    <ContactShadows
                        position={[0, -90, 0]}   // Sits just beneath the lowest tip of the apex
                        opacity={0.65}           // Shadow intensity
                        scale={220}              // Floor shadow spread
                        blur={5.0}               // Softness edge blur
                        far={300}                // Vertical projection distance
                        resolution={512}
                        color="#050508"
                    />
                </Suspense>

                {/* Rendered at world root to match THREE.Plane world-space coordinate evaluation */}
                <SlicePlaneHelper
                    clipPlane={clipPlane}
                    size={180}
                    visible={sliceEnabled && showPlaneGuide}
                />

                <CameraController
                    resetTrigger={resetTrigger}
                    initialPos={initialCameraPos}
                    preset={defaultPreset}
                    syncEnabled={syncEnabled}
                    syncedCameraRef={syncedCameraRef}
                    index={index}
                />
            </Canvas>
            
            {/* Hover popup */}
            {hoverInfo && (
            <div
                style={{
                position: 'fixed',
                left: hoverInfo.x + 12,
                top: hoverInfo.y + 12,
                background: 'rgba(0, 0, 0, 0.85)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '14px',
                zIndex: 99999,
                pointerEvents: 'none',
                }}
            >
                {HeartParts[hoverInfo.name]?.name ?? hoverInfo.name}
            </div>
            )}

            {!syncEnabled && (
                <>
                    <HeartController
                        handleResetView={handleResetView}
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                        showEpi={showEpi}
                        setShowEpi={setShowEpi}
                    />
                    <ViewerControls
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                        syncEnabled={syncEnabled}
                        showEpi={showEpi}
                        setShowEpi={setShowEpi}
                        ventricleOnly={ventricleOnly}
                        setVentricleOnly={setVentricleOnly}
                        fullView={fullView}
                        handleFullView={handleFullView}
                        handleResetView={handleResetView}
                        handleVentricleView={handleVentricleView}

                    />
                    <SliceControls
                        index={index}
                        sliceControlEnabled={sliceControlEnabled}
                        setSliceControlEnabled={setSliceControlEnabled}
                        sliceEnabled={sliceEnabled}
                        setSliceEnabled={setSliceEnabled}
                        showPlaneGuide={showPlaneGuide}
                        setShowPlaneGuide={setShowPlaneGuide}
                        activePreset={activePreset}
                        setActivePreset={setActivePreset}
                        pitch={pitch}
                        setPitch={setPitch}
                        yaw={yaw}
                        setYaw={setYaw}
                        sliceDistance={sliceDistance}
                        handlePresetSelect={handlePresetSelect}
                        handleDepthSliderChange={handleDepthSliderChange}
                    />
                </>
            )}
        </div>
    )
}