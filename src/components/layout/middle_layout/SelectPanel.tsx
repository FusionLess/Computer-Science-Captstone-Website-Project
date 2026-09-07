import "./SelectPanel.css"
import type {HeartCategory, HeartOption} from "../../types/states.ts";
import { useState } from "react";

function SelectPanel({setSelecting, chooseSelection}:
                     {setSelecting: (isSelecting: boolean) => void,
                     chooseSelection: (selection1: HeartOption) => void})
{
    const [currentSelection, setCurrentSelection] = useState<HeartOption>(null);
    const toggles: { id: HeartCategory; label: string }[] = [
        {id:"healthy", label:"Healthy"},
        {id:"attack", label:"Heart Attack"},
        {id:"electricity", label:"Electricity"},
        {id:"failure", label:"Failure"}
    ]

    const options: Record<HeartCategory, HeartOption[]> = {
        healthy: ["Normal"],
        attack: ["Minor", "Severe"],
        electricity: ["Fibrillation"],
        failure: ["Compensated", "Decompensated"]
    };

    return (
        <div className="select_panel">
            <div className="selections">
                {toggles.map(opt => (
                    <div className = "column">
                        <h3 className="labels">
                            {opt.label}
                        </h3>
                        <div className="selectables">
                            {options[opt.id].map(option => (
                                <button
                                    className={currentSelection === option ? "selected" : ""}
                                    onClick={() => setCurrentSelection(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="confirm_panel">
                <button onClick={() => {setSelecting(false), chooseSelection(currentSelection)}}>
                    Confirm
                </button>
                <button onClick={() => setSelecting(false)}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default SelectPanel

