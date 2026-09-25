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
                <HeartButtons active={active} setActive={setActive} compareState={CompareState}/>
            </aside>
        </>
    )
}

function HeartButtons({active, setActive, compareState} :
    { active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState }) {
    const { setIsComparing } = compareState
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
                                onClick={() => {
                                    setIsComparing(false)
                                    setActive({
                                        category: opt.id,
                                        option: defaultOptions[opt.id]
                                    })
                                }}>
                            {opt.label}
                        </button>
                        {options[opt.id].length > 1 && (
                            <div className={`dropdown ${active.category === opt.id ? "open" : "closing"}`}>
                                {options[opt.id].map(option => (
                                    <button
                                        key={option}
                                        className={`${optionTone[option]} ${
                                            active.option === option ? "selected" : ""
                                        }`}
                                        onClick={() => {
                                            setIsComparing(false)
                                            setActive({
                                                category: opt.id,
                                                option
                                            })
                                        }}
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

export default LeftBox