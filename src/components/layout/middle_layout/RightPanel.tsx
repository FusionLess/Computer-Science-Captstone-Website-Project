import {useEffect, useState} from "react";
import "./RightPanel.css"
import HeartPartInfo from "../HeartPartInfo";
import type { CompareState } from "../../types/compare.ts"
import { DESCRIPTIONS } from "../../../data/HeartDescriptions.ts";

function RightBox({compareState, selectedPart} :
                  {compareState : CompareState, selectedPart: string | null}) {
    const isMobile = window.matchMedia("(width < 800px)").matches;
    const active = compareState.selection1

    const [isOpen, setIsOpen] = useState(!isMobile);

    useEffect(() => {
        if (compareState.isComparing) {
            setIsOpen(false)
        } else if (!isMobile) {
            setIsOpen(true)
        }
    }, [compareState.isComparing, isMobile])

    return (
        <aside className = {`right ${isOpen ? "" : "collapsed"}`}>

            { isOpen && <button className="right_toggle open" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-chevrons-right">
                    <path d="m6 17 5-5-5-5"/>
                    <path d="m13 17 5-5-5-5"/>
                </svg>
            </button>}
            {!isOpen && <button className="right_toggle closed" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-chevrons-left">
                    <path d="m11 17-5-5 5-5"/>
                    <path d="m18 17-5-5 5-5"/>
                </svg>
            </button>}

            <div className={`right_content ${isOpen ? "" : "closed"}`}>
                <div className="heart_state_info">
                    <h3>
                        {DESCRIPTIONS[active.option as keyof typeof DESCRIPTIONS].heading}
                    </h3>
                    { DESCRIPTIONS[ active.option as keyof typeof DESCRIPTIONS].description}
                </div>
                <HeartPartInfo selectedPart={selectedPart} />

            </div>
        </aside>
    )
}

export default RightBox;