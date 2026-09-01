import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import { HeartModel } from '../components/HeartModel'


export default function HeartViewerPage() {
    const [bpm, setBpm] = useState(60)
    const [isPaused, setIsPaused] = useState(false)
    const [showEpi, setShowEpi] = useState(true)

    // sets the preset states you can slice the heart
    const [sliceEnabled, setSliceEnabled] = useState(false)
    const [pitch, setPitch] = useState(-90) // Points normal downward (-Y) to cut off superior structures
    const [yaw, setYaw] = useState(0)
    const [sliceDistance, setSliceDistance] = useState(-20) // Initial height at the atrioventricular junction

    // sets the preset independent depth slices per selection
    const [activePreset, setActivePreset] = useState('shortAxis')
    const [presetDepths, setPresetDepths] = useState({
        frontal: 0,
        sagittal: -3,
        shortAxis: -18,
    })

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
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#111' }}>
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
                            bpm={bpm} // exposes the options for the heart model in the viewer such as the options listed below
                            showEpi={showEpi}
                            clipPlane={clipPlane}
                            isPaused={isPaused}
                            rotation={[-Math.PI / 12, -Math.PI / 3, 0]} // tweaks the pitch and yaw of the heart in the viewer
                        />
                    </Center>
                </Suspense>

                <OrbitControls
                    makeDefault
                    target={[0, 0, 0]}
                    onChange={(e) => {
                        const cam = e?.target?.object
                        // if (cam) {
                        //   console.log(
                        //     `camera pos: [${cam.position.x.toFixed(0)}, ${cam.position.y.toFixed(0)}, ${cam.position.z.toFixed(0)}]`
                        //   )
                        // }
                        // old debug options to find out where the camera coordinates should begin
                    }}
                />
            </Canvas>

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

                {/* Epicardium Toggle (outside wall thing) */}
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