import "./LeftPanel.css"
import type {HeartState} from "../../types/states.ts";
import type {HeartCategory} from "../../types/states.ts";
import type {HeartOption} from "../../types/states.ts";
import { useState } from "react";
import SelectPanel from "./SelectPanel.tsx"
import type { CompareState } from "../../types/compare.ts"

function LeftBox({active, setActive, compareState} :
                 {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState }) {
    return (
        <aside className="left box">
            <HeartButtons active={active} setActive={setActive} />
            <CompareButtons compareState={compareState}/>
        </aside>
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

    const selections : Record<HeartOption, string> = {
        "Normal" : "Normal Heart",
        "Minor" : "Minor Attack",
        "Severe" : "Severe Attack",
        "Fibrillation" : "Fibrillation",
        "Compensated" : "Compensated Heart",
        "Decompensated" : "Decompensated Heart"
}

    return (
    <div className="compare">
        <h5 className="left_heading">Compare</h5>
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
        { isSelecting1 &&
            <SelectPanel setSelecting={setSelecting1} chooseSelection={chooseSelection1} />
        }
        { isSelecting2 &&
            <SelectPanel setSelecting={setSelecting2} chooseSelection={chooseSelection2} />
        }
        {
            (isSelecting1 || isSelecting2) &&
            <div className="backdrop" onClick={() => {setSelecting1(false), setSelecting2(false)}} />
        }
    </div>
    )
}

export default LeftBox