import "./LeftPanel.css"
import type {HeartState} from "../../types/states.ts";
import type {HeartCategory} from "../../types/states.ts";
import type {HeartOption} from "../../types/states.ts";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { CompareState } from "../../types/compare.ts";
import SelectPanel from "./SelectPanel.tsx";


function LeftBox({active, setActive, compareState} :
                 {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState}) {
    const [isMobileConditionsOpen, setIsMobileConditionsOpen] = useState(false)

    return (
        <>
            <button
                className={`mobile_conditions_button ${isMobileConditionsOpen ? "active" : ""}`}
                onClick={() => setIsMobileConditionsOpen((open) => !open)}
                aria-expanded={isMobileConditionsOpen}
            >
                Heart Conditions
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-chevron-down preview-icon">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>

            <aside
                className={`left box ${
                    isMobileConditionsOpen ? "mobile_open" : ""
                }`}
            >
                <HeartButtons active={active} setActive={setActive}/>
                <CompareButtons compareState={compareState} />
            </aside>
        </>
    )
}

function HeartButtons({active, setActive} :
                      {active: HeartState, setActive: (v: HeartState) => void}) {
    const toggles: { id: HeartCategory; label: string }[] = [
        {id:"healthy", label:"The Heart"},
        {id:"attack", label:"Attack"},
        {id:"electricity", label:"Electricity"},
        {id:"failure", label:"Failure"}
    ]

    const defaultOptions: Record<HeartCategory, HeartOption> = {
        healthy: "Healthy",
        attack: "Healthy",
        electricity: "Healthy",
        failure: "Healthy"
    };

    const options: Record<HeartCategory, HeartOption[]> = {
        healthy: ["Healthy"],
        attack: ["Healthy", "Minor", "Severe"],
        electricity: ["Healthy", "Fibrillation"],
        failure: ["Healthy", "Compensated", "Decompensated"]
    };

    // Colors for each option
    const optionTone: Record<HeartOption, string> = {
        Healthy: "green",
        Minor: "amber",
        Severe: "red",
        Fibrillation: "red",
        Compensated: "amber",
        Decompensated: "red",
    };

    return (
        <>
            <h5 className="left_heading">Heart Conditions</h5>
            <div className="toggle_buttons">
                {toggles.map(opt => (
                    <div className = "options">
                        <button id={opt.id}
                                key={opt.id}
                                className={`${opt.id} ${active.category === opt.id ? "active" : "inactive"}`}
                                onClick={() => setActive({
                                    category: opt.id,
                                    option: defaultOptions[opt.id]
                                })}>
                            {opt.label}
                        </button>
                        {options[opt.id].length > 1 && (
                            <div className={`dropdown ${active.category === opt.id ? "open" : "closing"}`}>
                                {options[opt.id].map(option => (
                                    <button
                                        key={option}
                                        className={`${optionTone[option]} ${active.option === option ? "selected" : ""}`}
                                        onClick={() => setActive({ category: opt.id, option })}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
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

export default LeftBox