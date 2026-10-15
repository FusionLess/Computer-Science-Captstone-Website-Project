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
                                            sliceEnabled,
                                            onOpenSliceControls
                                        }) {
    const [controlsShowing, setControlsShowing] = useState(() => !window.matchMedia("(orientation: portrait)").matches)
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-sliders-horizontal preview-icon">
                    <path d="M10 5H3"/>
                    <path d="M12 19H3"/>
                    <path d="M14 3v4"/>
                    <path d="M16 17v4"/>
                    <path d="M21 12h-9"/>
                    <path d="M21 19h-5"/>
                    <path d="M21 5h-7"/>
                    <path d="M8 10v4"/>
                    <path d="M8 12H3"/>
                </svg>
                {controlsShowing ? 'HIDE' : 'CONTROLS'}
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
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-play preview-icon">
                            <path
                                d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round">
                        <defs>
                            <path id="stacked-heart"
                                  d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5Z"/>

                            <mask id="stacked-heart-mask"
                                  maskUnits="userSpaceOnUse"
                                  x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="white" stroke="none"/>
                                <use href="#stacked-heart"
                                     transform="translate(0 2) scale(.8)"
                                     fill="black" stroke="black" stroke-width="3"/>
                            </mask>
                        </defs>

                        <g mask="url(#stacked-heart-mask)">
                            <use href="#stacked-heart"
                                 transform="translate(5 2) scale(.8)"/>
                        </g>

                        <use href="#stacked-heart"
                             transform="translate(0 2) scale(.8)"/>
                    </svg>

                    {ventricleOnly ? 'FULL HEART' : 'VENTRICLES'}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (fullView) {
                            onOpenSliceControls?.()
                        }
                        handleFullView()
                    }}
                    className={`full-view-button${!sliceEnabled && fullView ? ' is-active' : ''}`}
                >
                    {(fullView && !sliceEnabled) ?
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                            <path d="M12 7v14" stroke-dasharray="2 3"/>
                        </svg>
                        SLICE
                        </> :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" className="lucide lucide-heart preview-icon">
                                <path
                                    d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                            </svg>
                            FULL
                        </>}
                </button>
            </div>
        </div>
    )
}
