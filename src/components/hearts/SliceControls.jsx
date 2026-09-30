export default function SliceControls({
    index,
    shared = false,
    sliceControlEnabled,
    setSliceControlEnabled,
    sliceEnabled,
    setSliceEnabled,
    showPlaneGuide,
    setShowPlaneGuide,
    activePreset,
    setActivePreset,
    pitch,
    setPitch,
    yaw,
    setYaw,
    sliceDistance,
    handlePresetSelect,
    handleDepthSliderChange,
}) {
    return (
        <div
            style={{
                position: shared ? 'relative' : 'absolute',

                ...(shared
                    ? {
                        bottom: 'auto',
                        left: 'auto',
                        right: 'auto',
                        transform: 'none',
                        direction: 'ltr',
                    }
                    : {
                        bottom: '50%',
                        transform: 'translateY(50%)',
                        ...(index === 0
                            ? { left: '24px', direction: 'ltr' }
                            : { right: '24px', direction: 'rtl' }
                        ),
                    }
                ),
                padding: '0',
                alignItems: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
                zIndex: 10,
            }}
        >
            <button onClick={() => setSliceControlEnabled(!sliceControlEnabled)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "40px",
                    background: 'rgba(230, 230, 230, 0.5)',
                    borderRadius: '12px',
                    height: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                }}>
                {sliceControlEnabled ? "〇" : "◐"}
            </button>

            {/* Slicing Controls */}
            {sliceControlEnabled && (
                <div style={{
                    background: 'rgba(230, 230, 230, 0.5)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px',
                    boxSizing: 'border-box',
                }}>
                    

                    <div style={{ display: 'flex', flexDirection: shared ? 'row' : 'column', alignItems: shared ? 'center' : 'stretch', gap: shared ? '16px' : '10px'}}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px' }}>
                                <span style={{ fontWeight: 600 }}>Enable Oblique Slice</span>
                                <input
                                    type="checkbox"
                                    checked={sliceEnabled}
                                    onChange={(e) => setSliceEnabled(e.target.checked)}
                                    style={{ cursor: 'pointer', accentColor: '#3498db' }}
                                />
                            </label>
                            {/* Guide Plane Visibility Toggle */}
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: 'black' }}>
                                <span>Show Slice Indicator</span>
                                <input
                                    type="checkbox"
                                    checked={showPlaneGuide}
                                    onChange={(e) => setShowPlaneGuide(e.target.checked)}
                                    style={{ cursor: 'pointer', accentColor: '#3498db' }}
                                />
                            </label>
                        </div>

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'black' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'black' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'black' }}>
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
                </div>
            )}
        </div>
    )
}