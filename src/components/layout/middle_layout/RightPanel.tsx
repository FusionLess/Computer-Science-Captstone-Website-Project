import {useState} from "react";
import "./RightPanel.css"
import HeartPartInfo from "../HeartPartInfo";
import type { HeartState } from "../../types/states.ts";
import type { CompareState } from "../../types/compare.ts"
import { DESCRIPTIONS } from "../../../data/HeartDescriptions.ts";

function RightBox({active, compareState, selectedPart} :
                  {active: HeartState, compareState : CompareState, selectedPart: string | null}) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <aside className = "right box">
            { isOpen && <button className="right_collapse" onClick={() => setIsOpen(!isOpen)}> » </button>}
            { !isOpen && <button className="right_open" onClick={() => setIsOpen(!isOpen)}> « </button>}
            <div className = {`right_content ${isOpen ? "" : "closed"}`}>
                <div className  ="heart_state_info">
                    <h3>
                        { DESCRIPTIONS[ active.option as keyof typeof DESCRIPTIONS].heading}
                    </h3>
                    { DESCRIPTIONS[ active.option as keyof typeof DESCRIPTIONS].description}
                </div>
                <HeartPartInfo selectedPart={selectedPart} />

            </div>
        </aside>
    )
}

export default RightBox;