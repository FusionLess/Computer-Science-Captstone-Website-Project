import "./LeftPanel.css"
import type {HeartState} from "../../types/states.ts";
import type {HeartCategory} from "../../types/states.ts";
import type {HeartOption} from "../../types/states.ts";


function LeftBox({active, setActive} :
                 {active: HeartState, setActive: (v: HeartState) => void }) {
    return (
        <aside className="left box">
            <HeartButtons active={active} setActive={setActive} />
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


export default LeftBox