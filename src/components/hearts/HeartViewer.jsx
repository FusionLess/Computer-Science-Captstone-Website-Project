import React, { Suspense, useState, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Center, ContactShadows } from '@react-three/drei'

import { HeartModel } from './HeartModel.jsx'
import { SliceCap } from './SliceCap.jsx'
import { SlicePlaneHelper } from './SlicePlaneHelper.jsx'
import CameraController from './CameraController.jsx'
import SliceControls from './SliceController.jsx'

import { HeartParts } from '../../data/HeartParts.ts'
import { useHeartMonitor } from "../context/HeartMonitorContext.tsx"
import HeartController from './HeartController'


// const INITIAL_CAMERA_POS = [-225, -20, -200]
const CAMERA_POSITIONS = {
    frontal: [-193, 0, -230],
    shortAxis: [0, 300, 0],
    sagittal: [-230, 0 , 193],

    topDown: [0.1, 300, 0.02],
    tiltedShortAxis: [280, 150, 56],
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
    useSharedControls,
    showSyncedControls,

    sharedShowEpi,
    setSharedShowEpi,

    sharedVentricleOnly,
    setSharedVentricleOnly,

    sharedFullView,
    setSharedFullView,

    sharedSliceEnabled,
    setSharedSliceEnabled,
    sharedShowPlaneGuide,
    setSharedShowPlaneGuide,
    sharedActivePreset,
    setSharedActivePreset,
    sharedPitch,
    setSharedPitch,
    sharedYaw,
    setSharedYaw,
    sharedSliceDistance,
    setSharedSliceDistance,
    complexity,
    showAdvancedSliceControls,
    showControls,
    cameraView,
    cameraViewResetTrigger = 0,
    externalClipPlane,
    animationPhase,
}) {
    const defaultPreset = "frontal"

    const viewPreset = cameraView ?? defaultPreset
    const initialCameraPos = CAMERA_POSITIONS[viewPreset] ?? CAMERA_POSITIONS[defaultPreset]
    const [resetTrigger, setResetTrigger] = useState(0)
    const [cameraPreset, setCameraPreset] = useState(defaultPreset)

    const effectiveCameraPreset = cameraView
    ?? (useSharedControls
        ? sharedActivePreset ?? defaultPreset
        : cameraPreset)
    const capStyleRef = useRef(null)
    const [viewMode, setViewMode] = useState('3d')
    const { bpm, isPaused, setIsPaused, singlePhase } = useHeartMonitor()

    // sets the preset states you can slice the heart
    const [sliceControlEnabled, setSliceControlEnabled] = useState(false)
    const [localSliceEnabled, setLocalSliceEnabled] =
        useState(false)

    const [localShowPlaneGuide, setLocalShowPlaneGuide] =
        useState(false)

    const [localPitch, setLocalPitch] = useState(0)
    const [localYaw, setLocalYaw] = useState(40)
    const [localSliceDistance, setLocalSliceDistance] = useState(0)

    const [localActivePreset, setLocalActivePreset] =
        useState(defaultPreset)
    const setSliceOrientation = (pitch, yaw, depth) => {
        setPitch(pitch)
        setYaw(yaw)
        setSliceDistance(depth)
    }
    const sliceEnabled = useSharedControls
        ? sharedSliceEnabled
        : localSliceEnabled

    const setSliceEnabled = useSharedControls
        ? setSharedSliceEnabled
        : setLocalSliceEnabled


    const showPlaneGuide = useSharedControls
        ? sharedShowPlaneGuide
        : localShowPlaneGuide

    const setShowPlaneGuide = useSharedControls
        ? setSharedShowPlaneGuide
        : setLocalShowPlaneGuide


    const pitch = useSharedControls
        ? sharedPitch
        : localPitch

    const setPitch = useSharedControls
        ? setSharedPitch
        : setLocalPitch


    const yaw = useSharedControls
        ? sharedYaw
        : localYaw

    const setYaw = useSharedControls
        ? setSharedYaw
        : setLocalYaw


    const sliceDistance = useSharedControls
        ? sharedSliceDistance
        : localSliceDistance

    const setSliceDistance = useSharedControls
        ? setSharedSliceDistance
        : setLocalSliceDistance


    const activePreset = useSharedControls
        ? sharedActivePreset
        : localActivePreset

    const setActivePreset = useSharedControls
        ? setSharedActivePreset
        : setLocalActivePreset

    const [localShowEpi, setLocalShowEpi] = useState(true)
    const [localVentricleOnly, setLocalVentricleOnly] = useState(false)
    const [localFullView, setLocalFullView] = useState(true)

    const showEpi = useSharedControls
        ? sharedShowEpi
        : localShowEpi

    const setShowEpi = useSharedControls
        ? setSharedShowEpi
        : setLocalShowEpi


    const ventricleOnly = useSharedControls
        ? sharedVentricleOnly
        : localVentricleOnly

    const setVentricleOnly = useSharedControls
        ? setSharedVentricleOnly
        : setLocalVentricleOnly


    const fullView = useSharedControls
        ? sharedFullView
        : localFullView

    const setFullView = useSharedControls
        ? setSharedFullView
        : setLocalFullView

    useEffect(() => {
        setLocalFullView(true)
        setVentricleOnly(false)
        
        setSliceEnabled(false)
        setShowPlaneGuide(false)
       
        setLocalActivePreset("frontal")
        setCameraPreset("frontal")

        setResetTrigger(prev => prev + 1)
    }, [frameFolder, complexity])

    // sets the preset independent depth slices per selection
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
            setPitch(0)
            setYaw(40)
            setSliceDistance(0)

            setCameraPreset(defaultPreset)
            setResetTrigger(prev => prev + 1)

        } else {
            setFullView(false)
            setSliceEnabled(true)
            setShowPlaneGuide(true)

            setActivePreset(defaultPreset)
            setSliceOrientation(0, 40, 0)

            setCameraPreset(defaultPreset)
            setResetTrigger(prev => prev + 1)
        }
    }

    const handleResetView = () => {
        setFullView(false)
        setVentricleOnly(true)
        setShowEpi(true)
        setSliceEnabled(true)
        setShowPlaneGuide(true)
        
        setActivePreset("frontal")
        setSliceOrientation(0, 40, 0)
        setCameraPreset("frontal")

        if (syncEnabled && setSharedResetTrigger) {
            setSharedResetTrigger((prev) => prev + 1)
        } else {
            setResetTrigger((prev) => prev + 1)
        }
    }
    const handleVentricleView = () => {
        const next = !ventricleOnly
        setVentricleOnly(next)
        setFullView(false)
        if (next && activePreset === "shortAxis") {
            // but move to a useful ventricular depth
            setPitch(-90)
            setYaw(0)
            setSliceDistance(-12)
        }
    }
    // tidies up the onClick part of the button to set the preset values of each slicing view
    const handlePresetSelect = (presetKey, p, y) => {
        setFullView(false)
        setSliceEnabled(true)
        setVentricleOnly(true)
        setShowPlaneGuide(true)
        setActivePreset(presetKey)
        setPitch(p)
        setYaw(y)
        setSliceDistance(presetDepths[presetKey])
        
        setCameraPreset(presetKey)
        setResetTrigger(prev => prev + 1)
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

    const handleSliceToggle = (enabled) => {
        setSliceEnabled(enabled)

        if (enabled) {
            setFullView(false)
            setVentricleOnly(true)

            setActivePreset(defaultPreset)
            setSliceOrientation(0, 40, 0)

            setCameraPreset(defaultPreset)
            setResetTrigger(prev => prev + 1)
        }
    }
    const [hoverInfo, setHoverInfo] = useState(null)

    // compute arbitrary 3d normal vector from pitch and yaw
    const modelClipPlane = useMemo(() => {
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

    const clipPlane = externalClipPlane ?? modelClipPlane

    return (
      
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--background-colour)' }}>
             {title && (
                <h3 className="heart-viewer-title"
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
                onCreated={({ camera }) => {
                    camera.layers.enable(1)
                }}
                camera={{ position: initialCameraPos, fov: 45 }}
                gl={{
                    logarithmicDepthBuffer: true,
                    antialias: true,
                    localClippingEnabled: true,
                    stencil: true,
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
                            capStyleRef={capStyleRef}
                            beatPhase={singlePhase}
                            animationPhase={animationPhase}
                            rotation={[-Math.PI / 12, -Math.PI / 3, 0]} // tweaks the pitch and yaw of the heart in the viewer
                            onSelect={setSelectedPart}
                            onHover={setHoverInfo}
                            
                        />
                    </Center>
                    <SliceCap clipPlane={clipPlane} capStyleRef={capStyleRef} />

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
                    resetTrigger={resetTrigger + cameraViewResetTrigger}
                    initialPos={CAMERA_POSITIONS[effectiveCameraPreset]}
                    preset={effectiveCameraPreset}
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

            {showControls !== false && (!useSharedControls || showSyncedControls) && (
                <>
                    <div className="viewer-controls">

                        <HeartController
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
                            setSliceEnabled={handleSliceToggle}
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
                            complexity={complexity}
                            showAdvancedSliceControls={showAdvancedSliceControls}

                        />
                    </div>
                </>
            )}
        </div>
    )
}
