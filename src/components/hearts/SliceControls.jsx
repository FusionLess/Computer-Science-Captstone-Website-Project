import './Controller.css'
import './SliceController.css'

import { useId, useState } from 'react'

export default function SliceController({
    index,
    shared = false,
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
    complexity,
    showAdvancedSliceControls
}) {

    const [controlsShowing, setControlsShowing] = useState(true)
    const controlsId = useId()

    const showSliders =  showAdvancedSliceControls
    return (
        <div
        className={`controller slice-controller
                ${controlsShowing ? '' : 'is-collapsed'}
                ${shared ? 'is-shared' : ''}
                ${index === 1 ? 'is-right' : ''}
            `}
        >
            <button
                type="button"
                className="show-controls-button"
                onClick={() => setControlsShowing(prev => !prev)}
                aria-expanded={controlsShowing}
                aria-controls={controlsId}
            >
                {controlsShowing ? 'HIDE' : 'SLICE CONTROLS'}
            </button>

            <div
                id={controlsId}
                className="controller-actions slice-controller-actions"
                inert={!controlsShowing}
                aria-hidden={!controlsShowing}
            >
                <div className="slice-options">
                    <button
                        type="button"
                        onClick={() => {
                            const next = !sliceEnabled
                            setSliceEnabled(next)
                            setShowPlaneGuide(next)
                        }}
                        className={sliceEnabled ? 'is-active' : ''}
                    >
                        <span>SLICE</span>
                        <span>{sliceEnabled ? 'OFF' : 'ON'}</span>
                    </button>
                    {sliceEnabled && (
                        <button
                            type="button"
                            onClick={() => setShowPlaneGuide(prev => !prev)}
                            className={showPlaneGuide ? 'is-active' : ''}
                        >
                            <span>INDICATOR</span>
                            <span>{showPlaneGuide ? 'OFF' : 'ON'}</span>    
                        </button>
                    )}
                </div>

                <div className="controller-divider" />

                <div className="slice-axis-presets">
                    <button
                        type="button"
                        onClick={() => handlePresetSelect('frontal', 0, 40)}
                        className={sliceEnabled && activePreset === 'frontal' ? 'is-active': ''}
                    >
                        FRONTAL
                    </button>

                    <button
                        type="button"
                        onClick={() => handlePresetSelect('sagittal', 0, 130)}
                        className={sliceEnabled && activePreset === 'sagittal' ? 'is-active' : ''}
                    >
                        SAGITTAL
                    </button>

                    <button
                        type="button"
                        onClick={() =>handlePresetSelect('shortAxis', -90, 0)}
                        className={sliceEnabled && activePreset === 'shortAxis' ? 'is-active' : ''}
                    >
                        SHORTAXIS
                    </button>
                </div>

                {showSliders && sliceEnabled && (
                    <>
                    
                        <div className="controller-divider" />

                        <div className="slice-adjustments">
                            <div className="slice-slider">
                                <div className="slice-slider-label">
                                    <span>PITCH</span>
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
                                />
                            </div>

                            <div className="slice-slider">
                                <div className="slice-slider-label">
                                    <span>YAW</span>
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
                                />
                            </div>

                            <div className="slice-slider">
                                <div className="slice-slider-label">
                                    <span>DEPTH</span>
                                    <span>{sliceDistance} mm</span>
                                </div>

                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={sliceDistance}
                                    onChange={(e) => handleDepthSliderChange(Number(e.target.value))}
                                />
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    )
}