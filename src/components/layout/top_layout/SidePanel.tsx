import "./SidePanel.css"
import { useState } from "react"
import { createPortal } from "react-dom"
import type { CompareState } from "../../types/compare.ts"
import type { HeartOption } from "../../types/states.ts"
import SelectPanel from "./SelectPanel.tsx"

function SidePanel({isOpen, graphActive, setGraphActive, compareState}:
                   { isOpen : boolean, graphActive:boolean, setGraphActive:(v : boolean)=>void, compareState: CompareState}) {
    const [complexity, setComplexity] = useState<string>("standard")

    const complexities = [
        {id:"basic", label: "Basic"},
        {id:"standard", label: "Standard"},
        {id:"advanced", label: "Advanced"},
    ]

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <CompareButtons compareState={compareState} />
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
            <div className="theme_selector">
                <button>◐</button>
            </div>
        </aside>
    )
}


function CompareButtons({compareState} : {compareState: CompareState})
{
    const [isSelecting1, setSelecting1] = useState<boolean>(false)
    const [isSelecting2, setSelecting2] = useState<boolean>(false)

    const {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    } = compareState;

    const clearSelections = () => {
        chooseSelection1(null)
        chooseSelection2(null)
        setIsComparing(false)
        setSelecting1(false)
        setSelecting2(false)
    }

    const selections : Record<HeartOption, string> = {
        "Healthy" : "Healthy Heart",
        "Minor" : "Minor Attack",
        "Severe" : "Severe Attack",
        "Fibrillation" : "Fibrillation",
        "Compensated" : "Compensated Heart",
        "Decompensated" : "Decompensated Heart"
    }

    return (
        <div className="compare">
            <div className="compare_heading">
                <h4>Compare hearts</h4>
                <button
                    className="clear_compare_button"
                    onClick={clearSelections}
                    aria-label="Clear heart comparison selections"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-rotate-ccw">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    Clear
                </button>
            </div>
            <div className="compare_options">
                <button id="primary" onClick={() => setSelecting1(true)}>
                    {selections[selection1] ?? "+"}
                </button>

                <button id="secondary" onClick={() => setSelecting2(true)}>
                    {selections[selection2] ?? "+"}
                </button>

                <button className="compare_button" onClick={()=> setIsComparing(!isComparing)}>
                    {isComparing ? "Stop Comparing" : "Compare"}
                </button>
            </div>
            {(isSelecting1 || isSelecting2) &&
                createPortal(
                    <>
                        <div className="backdrop" onClick={() => {setSelecting1(false), setSelecting2(false)}} />

                        { isSelecting1 &&
                            <SelectPanel setSelecting={setSelecting1} chooseSelection={chooseSelection1} />
                        }

                        { isSelecting2 &&
                            <SelectPanel setSelecting={setSelecting2} chooseSelection={chooseSelection2} />
                        }
                    </>,
                    document.body,
                )}
        </div>
    )
}

export default SidePanel;