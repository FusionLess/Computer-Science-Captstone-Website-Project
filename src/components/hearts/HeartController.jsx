import './HeartController.css'
import "./Controller.css"
import { useId, useState } from 'react'

export default function HeartController({
                                            isPaused,
                                            setIsPaused,
                                            showEpi,
                                            setShowEpi,
                                            ventricleOnly,
                                            setVentricleOnly,
                                            fullView,
                                            handleFullView,
                                            handleResetView,
                                            handleVentricleView,
                                            sliceEnabled
                                        }) {
    const [controlsShowing, setControlsShowing] = useState(true)
    const controlsId = useId()

    return (
        <div className={`controller heart-controller${controlsShowing ? '' : ' is-collapsed'}`}>
            <button
                type="button"
                onClick={() => setControlsShowing(controlsShowing => !controlsShowing)}
                className={`show-controls-button ${controlsShowing ? 'showing' : 'hiding'}`}
                aria-expanded={controlsShowing}
                aria-controls={controlsId}
                >
                { controlsShowing ? 'HIDE' : 'HEART CONTROLS' }
            </button>
            <div
                id={controlsId}
                className="controller-actions heart-controller-actions"
                inert={!controlsShowing}
                aria-hidden={!controlsShowing}
            >
                <button
                    type="button"
                    onClick={handleResetView}
                    className="reset-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-rotate-ccw preview-icon">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    RESET
                </button>

                {/* Pause Button */}
                <button
                    type="button"
                    onClick={() => setIsPaused((prev) => !prev)}
                    className={`pause-button${isPaused ? ' is-active' : ''}`}
                >
                    {isPaused ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-play preview-icon">
                            <path
                                d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-pause preview-icon">
                            <rect x="14" y="3" width="5" height="18" rx="1"/>
                            <rect x="5" y="3" width="5" height="18" rx="1"/>
                        </svg>
                    )}
                    {isPaused ? 'RESUME' : 'PAUSE'}
                </button>

                {/* Epicardium Toggle */}
                <button
                    onClick={() => setShowEpi(showEpi => !showEpi)}
                    className={`epi-button${showEpi ? ' is-active' : ''}`}>
                    {showEpi ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-circle-dot-dashed preview-icon">
                            <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0"/>
                            <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7"/>
                            <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8"/>
                            <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69"/>
                            <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0"/>
                            <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7"/>
                            <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8"/>
                            <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/>
                            <circle cx="12" cy="12" r="1"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-circle-dot preview-icon">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                    )}
                    {showEpi ? 'HIDE EPI' : 'SHOW EPI'}
                </button>

                <button
                    type="button"
                    onClick={handleVentricleView}
                    className={`ventricle-button${ventricleOnly ? ' is-active' : ''}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="preview-icon"
                    >
                        <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5 5.5 4.5 8 4.1 10 6 12 8c2-2 4-3.9 6.5-3.5C22 5 23.5 9 21.5 12.5 19 16.65 12 21 12 21z" />
                    </svg>

                    {ventricleOnly ? 'SHOW ALL' : 'Ventricles'}
                </button>

                <button
                    type="button"
                    onClick={handleFullView}
                    className={`full-view-button${!sliceEnabled && fullView ? ' is-active' : ''}`}
                >
                    FULL VIEW
                </button>
            </div>
        </div>
    )}
