import {useEffect, useRef, useState} from "react";
import "./DescriptionPanel.css"
import HeartPartInfo from "./HeartPartInfo.tsx";
import type { CompareState } from "../../../components/types/compare.ts"
import { DESCRIPTIONS } from "../../../data/HeartDescriptions.ts";
import type { Complexity } from "../../../components/types/complexities.ts";
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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasMoreBelow, setHasMoreBelow] = useState(false);

    useEffect(() => {
        const panel = scrollRef.current;
        if (!panel) return;

        const updateFade = () => setHasMoreBelow(
            panel.scrollHeight - panel.clientHeight - panel.scrollTop > 2
        );

        updateFade();
        panel.addEventListener("scroll", updateFade, {passive: true});
        const observer = new ResizeObserver(updateFade);
        observer.observe(panel);
        Array.from(panel.children).forEach(child => observer.observe(child));

        return () => {
            panel.removeEventListener("scroll", updateFade);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!selectedPart) return;

        requestAnimationFrame(() => {
            heartPartInfoRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }, [selectedPart]);

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
                <div className={`right_scroll ${hasMoreBelow ? "has_more_below" : ""}`} ref={scrollRef}>
                    <div className="heart_state_info">
                        <p className={`current_selection ${selectionTone[active.option]}`}>
                            Current selection
                        </p>
                        <h3>
                            {DESCRIPTIONS[active.option as keyof typeof DESCRIPTIONS].heading}
                        </h3>

                        {DESCRIPTIONS[active.option as keyof typeof DESCRIPTIONS]
                            .description[complexity]}
                
                        <button className="explore_button heart" onClick={() => setShowPopup(true)}>
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
                    <div className="heart-part-info-anchor" ref={heartPartInfoRef} onClick={() =>
                        heartPartInfoRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        })
                    }>
                        <HeartPartInfo selectedPart={selectedPart} complexity={complexity}/>
                    </div>
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
