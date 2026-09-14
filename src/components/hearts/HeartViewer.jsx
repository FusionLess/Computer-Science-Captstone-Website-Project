import React, { Suspense, useState, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Center, ContactShadows } from '@react-three/drei'
import { HeartModel } from './HeartModel.jsx'
import { SlicePlaneHelper } from './SlicePlaneHelper.jsx'
import { HeartParts } from '../../data/HeartParts.ts'
import { useHeartMonitor } from "../context/HeartMonitorContext.tsx"

const INITIAL_CAMERA_POS = [-225, -20, -200]

function CameraController({ resetTrigger, initialPos = [-225, -20, -200] }) {
    const { camera } = useThree()
    const controlsRef = useRef(null)

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
        if (resetTrigger === 0 || !controlsRef.current) return

        startPos.current.copy(camera.position)
        startTarget.current.copy(controlsRef.current.target)
        startUp.current.copy(camera.up)

        startTimeRef.current = performance.now()
        animatingRef.current = true
    }, [resetTrigger, camera])

    useFrame(() => {
        if (!animatingRef.current || !controlsRef.current) return

        const elapsed = (performance.now() - startTimeRef.current) / 1000
        const rawT = Math.min(elapsed / DURATION, 1.0)

        // Smooth cubic ease-out: t = 1 - (1 - t)^3
        const t = 1.0 - Math.pow(1.0 - rawT, 3)

        camera.position.lerpVectors(startPos.current, endPos, t)
        camera.up.lerpVectors(startUp.current, endUp, t).normalize()
        controlsRef.current.target.lerpVectors(startTarget.current, endTarget, t)

        camera.lookAt(controlsRef.current.target)
        controlsRef.current.update()

        if (rawT >= 1.0) {
            animatingRef.current = false
            controlsRef.current.saveState()
        }
    })

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={240}
            maxDistance={380}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
        />
    )
}

export default function HeartViewer({ frameFolder, setSelectedPart }) {
    const [resetTrigger, setResetTrigger] = useState(0)

    const { bpm, setBpm, isPaused, setIsPaused, beatInterval } = useHeartMonitor()
    const [showEpi, setShowEpi] = useState(true)

    // sets the preset states you can slice the heart
    const [sliceEnabled, setSliceEnabled] = useState(false)
    const [showPlaneGuide, setShowPlaneGuide] = useState(true)
    const [pitch, setPitch] = useState(-90) // points the normal downward to cut off superior structures
    const [yaw, setYaw] = useState(0)
    const [sliceDistance, setSliceDistance] = useState(-20) // initial height at the atrioventricular junction

    // sets the preset independent depth slices per selection
    const [activePreset, setActivePreset] = useState('shortAxis')
    const [presetDepths, setPresetDepths] = useState({
        frontal: 0,
        sagittal: -3,
        shortAxis: -18,
    })

    const handleResetView = () => {
        setResetTrigger((prev) => prev + 1)
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
    const [selectedMesh, setSelectedMeshState] = useState(null)

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
    const [infoPosition, setInfoPosition] = useState({
        x: 20,
        y: 20,
    })

    const [isDragging, setIsDragging] = useState(false)

    const dragOffset = useRef({
        x: 0,
        y: 0,
    })
    const handlePointerDown = (event) => {
        setIsDragging(true)

        dragOffset.current = {
            x: event.clientX - infoPosition.x,
            y: event.clientY - infoPosition.y,
        }

        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event) => {
        if (!isDragging) return

        setInfoPosition({
            x: event.clientX - dragOffset.current.x,
            y: event.clientY - dragOffset.current.y,
        })
    }

    const handlePointerUp = (event) => {
        setIsDragging(false)
        event.currentTarget.releasePointerCapture(event.pointerId)
    }
    
    function setSelectedMesh(part) {
        const partName = typeof part === 'string' ? part : part?.name
        setSelectedMeshState(partName ?? null)
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--background-colour-2)' }}>
            <Canvas
                camera={{ position: [-225, -20, -200], fov: 45 }}
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
                    <Center>
                            <HeartModel
                            frameFolder={frameFolder}
                            bpm={bpm} // exposes the options for the heart model in the viewer such as the options listed below
                            showEpi={showEpi}
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
                        blur={2.0}               // Softness edge blur
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

                <CameraController resetTrigger={resetTrigger} initialPos={INITIAL_CAMERA_POS} />
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

            {/* Floating Control Panel */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    background: 'rgba(20, 20, 22, 0.9)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '260px',
                    zIndex: 10,
                }}
            >

                {/* Reset View Button */}
                <button
                    type="button"
                    onClick={handleResetView}
                    style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: '#2c2c30',
                        color: '#ffffff',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.background = '#3a3a40')}
                    onMouseLeave={(e) => (e.target.style.background = '#2c2c30')}
                >
                    Reset Camera View
                </button>

                {/* BPM Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#a0a0a5' }}>HEART RATE</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#e74c3c' }}>{bpm} BPM</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="range"
                            min="30"
                            max="180"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            style={{ cursor: 'pointer', accentColor: '#e74c3c', flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={() => setIsPaused((prev) => !prev)}
                            style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                background: isPaused ? '#e74c3c' : '#2c2c30',
                                color: '#ffffff',
                            }}
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                    </div>
                </div>

                {/* Epicardium Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px' }}>
                    <span>Outer Wall (Epi)</span>
                    <input
                        type="checkbox"
                        checked={showEpi}
                        onChange={(e) => setShowEpi(e.target.checked)}
                        style={{ cursor: 'pointer', accentColor: '#e74c3c' }}
                    />
                </label>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '2px 0' }} />

                {/* Slicing Controls */}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>Enable Oblique Slice</span>
                    <input
                        type="checkbox"
                        checked={sliceEnabled}
                        onChange={(e) => setSliceEnabled(e.target.checked)}
                        style={{ cursor: 'pointer', accentColor: '#3498db' }}
                    />
                </label>

                {sliceEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Guide Plane Visibility Toggle */}
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#a0a0a5' }}>
                            <span>Show Slice Indicator</span>
                            <input
                                type="checkbox"
                                checked={showPlaneGuide}
                                onChange={(e) => setShowPlaneGuide(e.target.checked)}
                                style={{ cursor: 'pointer', accentColor: '#3498db' }}
                            />
                        </label>

                        {/* Quick Clinical Views */}
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
                            <button
                                type="button"
                                onClick={() => handlePresetSelect('frontal', 0, 40)}
                                style={{
                                    padding: '4px 6px',
                                    fontSize: '10px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: activePreset === 'frontal' ? '#3498db' : '#2c2c30',
                                    color: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                Frontal
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePresetSelect('sagittal', 0, 130)}
                                style={{
                                    padding: '4px 6px',
                                    fontSize: '10px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: activePreset === 'sagittal' ? '#3498db' : '#2c2c30',
                                    color: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                Sagittal
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePresetSelect('shortAxis', -90, 0)}
                                style={{
                                    padding: '4px 6px',
                                    fontSize: '10px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: activePreset === 'shortAxis' ? '#3498db' : '#2c2c30',
                                    color: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                Short-Axis
                            </button>
                        </div>

                        {/* Pitch / Elevation */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0a0a5' }}>
                                <span>PITCH (TILT)</span>
                                <span>{pitch}°</span>
                            </div>
                            <input
                                type="range"
                                min="-90"
                                max="90"
                                value={pitch}
                                onChange={(e) => {
                                    setPitch(Number(e.target.value))
                                    setActivePreset(null)
                                }}
                                style={{ cursor: 'pointer', accentColor: '#3498db' }}
                            />
                        </div>

                        {/* Yaw / Rotation */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0a0a5' }}>
                                <span>YAW (ROTATION)</span>
                                <span>{yaw}°</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={yaw}
                                onChange={(e) => {
                                    setYaw(Number(e.target.value))
                                    setActivePreset(null)
                                }}
                                style={{ cursor: 'pointer', accentColor: '#3498db' }}
                            />
                        </div>

                        {/* Depth Distance */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0a0a5' }}>
                                <span>PLANE DEPTH</span>
                                <span>{sliceDistance} mm</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                value={sliceDistance}
                                onChange={(e) => handleDepthSliderChange(Number(e.target.value))}
                                style={{ cursor: 'pointer', accentColor: '#3498db' }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}