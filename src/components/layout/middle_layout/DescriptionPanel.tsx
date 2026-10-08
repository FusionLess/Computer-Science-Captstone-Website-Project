import {useEffect, useRef, useState} from "react";
import "./DescriptionPanel.css"
import HeartPartInfo from "./HeartPartInfo.tsx";
import type { CompareState } from "../../types/compare.ts"
import { DESCRIPTIONS } from "../../../data/HeartDescriptions.ts";
import type { Complexity } from "../../types/complexities.ts";
import PopUpInfoBox from "./PopUpInfoBox"

function RightBox({compareState, selectedPart, complexity} :
                  {compareState : CompareState, selectedPart: string | null, complexity: Complexity}) {
    const isMobile = window.matchMedia("(width < 800px)").matches;
    const active = compareState.selection1
    const selectionTone = {Healthy: "green", Minor: "amber", Severe: "red", Fibrillation: "blue", Compensated: "amber", Decompensated: "red",}

    const [isOpen, setIsOpen] = useState(true);
    const [showPopup, setShowPopup] = useState(false)
    const description =DESCRIPTIONS[active.option as keyof typeof DESCRIPTIONS]

    useEffect(() => {
        setIsOpen(!compareState.isComparing)
    }, [compareState.isComparing])

    const heartPartInfoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isMobile || !selectedPart) return;

        requestAnimationFrame(() => {
            heartPartInfoRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }, [selectedPart, isMobile]);

    return (
        <aside className = {`right ${isOpen ? "" : "collapsed"}`}>

            {!isMobile && isOpen && <button className="right_toggle open" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-chevrons-right">
                    <path d="m6 17 5-5-5-5"/>
                    <path d="m13 17 5-5-5-5"/>
                </svg>
            </button>}
            {!isMobile && !isOpen && <button className="right_toggle closed" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-chevrons-left">
                    <path d="m11 17-5-5 5-5"/>
                    <path d="m18 17-5-5 5-5"/>
                </svg>
            </button>}

            <div className={`right_content ${isOpen ? "" : "closed"}`}>
                <div className="heart_state_info">
                    <p className={`current_selection ${selectionTone[active.option]}`}>
                        Current selection
                    </p>
                    <h3>
                        {DESCRIPTIONS[active.option as keyof typeof DESCRIPTIONS].heading}
                    </h3>

                    {DESCRIPTIONS[active.option as keyof typeof DESCRIPTIONS]
                        .description[complexity]}
                
                    <button className="explore_button" onClick={() => setShowPopup(true)}>
                        <span className="explore_button_label">
                            Explore
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="16" x2="12" y2="12"/>
                                <line x1="12" y1="8" x2="12.01" y2="8"/>
                            </svg>
                        </span>
                    </button>

                </div>
                <div className="heart-part-info-anchor" ref={heartPartInfoRef}>
                    <HeartPartInfo selectedPart={selectedPart} complexity={complexity}/>
                </div>
            </div>
            {showPopup && (
                <PopUpInfoBox
                    variant="description"
                    title={description.heading}
                    description={description.description[complexity]}
                    media={description.media}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </aside>
    )
}

export default RightBox;