import "./LeftPanel.css"
import type {HeartState} from "../../types/states.ts";
import type {HeartCategory} from "../../types/states.ts";
import type {HeartOption} from "../../types/states.ts";
import { useState } from "react";
import SelectPanel from "./SelectPanel.tsx"
import SidePanel from "../top_layout/SidePanel.tsx";

function LeftBox({active, setActive} :
                 {active: HeartState, setActive: (v: HeartState) => void}) {
    return (
        <aside className="left box">
            <HeartButtons active={active} setActive={setActive} />
            <CompareButtons />
        </aside>
    )
}

function HeartButtons({active, setActive} :
                      {active: HeartState, setActive: (v: HeartState) => void}) {
    const toggles: { id: HeartCategory; label: string }[] = [
        {id:"healthy", label:"Healthy"},
        {id:"attack", label:"Heart Attack"},
        {id:"electricity", label:"Electricity"},
        {id:"failure", label:"Failure"}
    ]

    const defaultOptions: Record<HeartCategory, HeartOption> = {
        healthy: "Normal",
        attack: "Minor",
        electricity: "Fibrillation",
        failure: "Compensated"
    };

    const options: Record<HeartCategory, HeartOption[]> = {
        healthy: ["Normal"],
        attack: ["Minor", "Severe"],
        electricity: ["Fibrillation"],
        failure: ["Compensated", "Decompensated"]
    };

    return (
        <>
            <h5 className="left_heading">Heart States</h5>
            <div className="toggle_buttons">
                {toggles.map(opt => (
                    <div className = "options">
                        <button id={opt.id}
                                className={`${opt.id} ${active.category === opt.id ? "active" : "inactive"}`}
                                onClick={() => setActive({
                                    category: opt.id,
                                    option: defaultOptions[opt.id]
                                })}>
                            {opt.label}
                        </button>
                        <div className={`dropdown ${active.category === opt.id ? "open" : "closing"}`}>
                            {options[opt.id].map(option => (
                                <button
                                    key={option}
                                    className={active.option === option ? "selected" : ""}
                                    onClick={() => setActive({ category: opt.id, option })}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

function CompareButtons(){
    const [isSelecting, setSelecting] = useState<boolean>(false)
    return (
    <div className="compare">
        <h5 className="left_heading">Compare</h5>
        <div className="compare_options">
            <button id="primary" onClick={() => setSelecting(true)}> + </button>
            <button> + </button>
            <button className="compare_button"> Compare </button>
        </div>
        { isSelecting && <SelectPanel />}
        {isSelecting && <div className="backdrop" onClick={() => setSelecting(false)} />}
    </div>
    )
}

export default LeftBox