import "./LeftPanel.css"
import type { CompareState } from "../../types/compare.ts";
import { PAGE_DESCRIPTIONS } from "../../../data/HeartDescriptions.ts";
import type { Complexity } from "../../types/complexities.ts";

function LeftBox({compareState, complexity} :
                 {compareState: CompareState, complexity: Complexity}) {
    const {
        selection1,
        isComparing,
    } = compareState;

    const state = selection1.category
    const section = PAGE_DESCRIPTIONS[state as keyof typeof PAGE_DESCRIPTIONS]

    if (!isComparing) return (
        <>
            <aside className="left">
                <h5 className="left_subheading">{section.subheading}</h5>
                <h5 className="left_heading">{section.heading}</h5>
                <p className="left_body">{section.description}</p>
            </aside>
        </>
    )
    else return (
        <>
        </>
    )
}

export default LeftBox