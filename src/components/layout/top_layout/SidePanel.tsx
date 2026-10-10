import "./SidePanel.css"
import type { Complexity } from "../../types/complexities.ts";
import { complexities } from "../../types/complexities.ts";

function SidePanel({isOpen, graphActive, setGraphActive, glowActive,setGlowActive, complexity, setComplexity, showAdvancedSliceControls, setShowAdvancedSliceControls}:
    { isOpen: boolean, graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showAdvancedSliceControls: boolean, setShowAdvancedSliceControls: (v: boolean) => void}) {


    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
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


export default SidePanel;