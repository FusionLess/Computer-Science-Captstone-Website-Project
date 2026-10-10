import "./Settings.css"
import type { Complexity } from "../../types/complexities.ts";
import { complexities } from "../../types/complexities.ts";

function Settings({isOpen, onClose, graphActive, setGraphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions, showAdvancedSliceControls, setShowAdvancedSliceControls}:
                  { isOpen: boolean, onClose: () => void, graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void, showAdvancedSliceControls: boolean, setShowAdvancedSliceControls: (v: boolean) => void}) {

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
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
            <div className="settings_section">
                    <h4>Advanced Slice Controls</h4>
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
                </div>
            <div className="theme_selector">
                <button>◐</button>
            </div>
        </aside>
    )
}


export default Settings;