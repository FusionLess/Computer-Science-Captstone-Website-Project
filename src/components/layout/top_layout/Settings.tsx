import "./Settings.css"
import type { Complexity } from "../../types/complexities.ts";
import { complexities } from "../../types/complexities.ts";

function Settings({
                      isOpen,
                      onClose,
                      graphActive,
                      setGraphActive,
                      glowActive,
                      setGlowActive,
                      complexity,
                      setComplexity,
                      showDescriptions,
                      setShowDescriptions,
                      showAdvancedSliceControls,
                      setShowAdvancedSliceControls,
                      showVeins,
                      setShowVeins,
                      showArteries,
                      setShowArteries,
                      isDark,
                      setIsDark,
                      sliceEnabled
                      
                  }:
                  {
                      isOpen: boolean,
                      onClose: () => void,
                      graphActive: boolean,
                      setGraphActive: (v: boolean) => void,
                      glowActive: boolean,
                      setGlowActive: (v: boolean) => void,
                      complexity: Complexity,
                      setComplexity: (v: Complexity) => void,
                      showDescriptions?: boolean,
                      setShowDescriptions?: (value: boolean) => void,
                      showAdvancedSliceControls: boolean,
                      setShowAdvancedSliceControls: (v: boolean) => void,
                      showVeins?: boolean,
                      setShowVeins?: (value: boolean) => void,
                      showArteries?: boolean,
                      setShowArteries?: (value: boolean) => void,
                      isDark: boolean,
                      setIsDark: (value: boolean) => void,
                      sliceEnabled: boolean
                  }) {

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="settings_header">
                <div className="theme_selector">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        aria-label={isDark ? "Use light mode" : "Use dark mode"}
                        aria-pressed={isDark}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-sun preview-icon">
                                    <circle cx="12" cy="12" r="4"/>
                                    <path d="M12 2v2"/>
                                    <path d="M12 20v2"/>
                                    <path d="m4.93 4.93 1.41 1.41"/>
                                    <path d="m17.66 17.66 1.41 1.41"/>
                                    <path d="M2 12h2"/>
                                    <path d="M20 12h2"/>
                                    <path d="m6.34 17.66-1.41 1.41"/>
                                    <path d="m19.07 4.93-1.41 1.41"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-moon preview-icon">
                                    <path
                                        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
                                </svg>
                            )}
                        </svg>
                    </button>
                </div>
                <button
                    className="settings_close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-x preview-icon">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>
            <div className={'settings_section'} >
                <h4>Select Complexity Level</h4>
                <div className="selector_section">
                    {
                        complexities.map((c) => (
                            <button
                                id={c.id}
                                key={c.id}
                                className={c.id === complexity ? 'active': 'inactive'}
                                onClick={() => setComplexity(c.id)}
                            >
                                {c.label}
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className='settings_section' >
                <h4>Toggle Graphs</h4>
                <div className="selector_section">
                    <button className={graphActive ? "active" : "inactive"} onClick={() => setGraphActive(true)} >
                        On
                    </button>

                    <button
                        className={!graphActive ? "active" : "inactive"} onClick={() => setGraphActive(false)} >
                        Off
                    </button>
                </div>
            </div>
            <div className="settings_section">
                <h4>Toggle Glow On Waveforms</h4>
                <div className="selector_section">
                    <button className={glowActive ? "active" : "inactive"} onClick={() => setGlowActive(true)} >
                        On
                    </button>
                    <button
                        className={!glowActive ? "active" : "inactive"} onClick={() => setGlowActive(false)} >
                        Off
                    </button>
                </div>
            </div>
            {setShowDescriptions && typeof showDescriptions === "boolean" && (
                <div className="settings_section description_toggle">
                    <h4>Toggle Description</h4>

                    <div className="selector_section">
                        <button
                            className={showDescriptions ? "active" : "inactive"}
                            onClick={() => setShowDescriptions(true)}
                            aria-pressed={showDescriptions}
                        >
                            On
                        </button>

                        <button
                            className={!showDescriptions ? "active" : "inactive"}
                            onClick={() => setShowDescriptions(false)}
                            aria-pressed={!showDescriptions}
                        >
                            Off
                        </button>
                    </div>
                </div>
            )}
            {typeof showVeins === "boolean" && setShowVeins && (
                <div className="settings_section">
                    <h4>Show Coronary Veins</h4>
                    <div className="selector_section">
                        <button className={showVeins ? "active" : "inactive"}
                            onClick={() => setShowVeins(true)} aria-pressed={showVeins}>
                            On
                        </button>
                        <button className={!showVeins ? "active" : "inactive"}
                            onClick={() => setShowVeins(false)} aria-pressed={!showVeins}>
                            Off
                        </button>
                    </div>
                </div>
            )}
            {typeof showArteries === "boolean" && setShowArteries && (
                <div className="settings_section">
                    <h4>Show Coronary Arteries</h4>
                    <div className="selector_section">
                        <button className={showArteries ? "active" : "inactive"}
                            onClick={() => setShowArteries(true)} aria-pressed={showArteries}>
                            On
                        </button>
                        <button className={!showArteries ? "active" : "inactive"}
                            onClick={() => setShowArteries(false)} aria-pressed={!showArteries}>
                            Off
                        </button>
                    </div>
                </div>
            )}
            <div className="settings_section">
                <h4>Advanced Slice Controls</h4>
                {sliceEnabled ? (
                    <div className="selector_section">
                        <button
                            className={showAdvancedSliceControls ? "active" : "inactive"}
                            onClick={() => setShowAdvancedSliceControls(true)}
                        >
                            On
                        </button>

                        <button
                            className={!showAdvancedSliceControls ? "active" : "inactive"}
                            onClick={() => setShowAdvancedSliceControls(false)}
                        >
                            Off
                        </button>
                    </div>
                
                ) : (
                    <div className="slice-disabled-message">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>

                        <span>Turn on Slice to enable Advanced Slice Controls.</span>
                    </div>
                )}
            </div>
                
            {/* <div className="theme_selector">
                <button
                    onClick={() => setIsDark(!isDark)}
                    aria-label={isDark ? "Use light mode" : "Use dark mode"}
                    aria-pressed={isDark}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round" className="lucide lucide-sun preview-icon">
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M12 2v2"/>
                                <path d="M12 20v2"/>
                                <path d="m4.93 4.93 1.41 1.41"/>
                                <path d="m17.66 17.66 1.41 1.41"/>
                                <path d="M2 12h2"/>
                                <path d="M20 12h2"/>
                                <path d="m6.34 17.66-1.41 1.41"/>
                                <path d="m19.07 4.93-1.41 1.41"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round" className="lucide lucide-moon preview-icon">
                                <path
                                    d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
                            </svg>
                        )}
                    </svg>
                </button>
            </div> */}
        </aside>
    )
}


export default Settings;
