    import "./Content.css"

    import { HEART_STATE_TITLES } from "../../types/states.ts";
    import type { HeartCategory, HeartOption, HeartState } from "../../types/states.ts";
    import type { CompareState } from "../../types/compare.ts"

    import { FRAMES } from "../../types/frames.ts"
    import { useEffect, useState, useRef } from "react";

    
    import HeartViewerPage from "../../hearts/HeartViewer.jsx"
    import LeftBox from "./LeftPanel.tsx"
    import RightBox from "./RightPanel.tsx";
  
function Content({active, setActive, compareState} :
                 {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState}) {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    useEffect(() => {
        setSelectedPart(null);
    }, [active.category, active.option]);

    return (
        <main className="content">
            <LeftBox active={active} setActive={setActive} compareState={compareState}/>
            <MiddleBox active={active} setActive={setActive} compareState={compareState} setSelectedPart={setSelectedPart}/>
            <RightBox active={active} compareState={compareState} selectedPart={selectedPart} />
        </main>
    )
}


function MiddleBox({active, setActive, compareState, setSelectedPart}: {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState, setSelectedPart: (part: string | null) => void }) {
    const {selection1,selection2, chooseSelection1, chooseSelection2,isComparing, setIsComparing} = compareState

    const stopComparing = (option: HeartOption) => {
        setIsComparing(false)

        const categories: Record<HeartOption, HeartCategory> = {
            Normal: "healthy",
            Minor: "attack",
            Severe: "attack",
            Fibrillation: "electricity",
            Compensated: "failure",
            Decompensated: "failure"
        }

        setActive({category: categories[option], option: option})
    }
    const [syncEnabled, setSyncEnabled] = useState(false)
    const syncedCameraRef = useRef<{
        position: [number, number, number]
        target: [number, number, number]
        zoom: number
    } | null>(null)
    const [sharedResetTrigger, setSharedResetTrigger] = useState(0)

    // normal
    if (!isComparing) {
        return (
            <aside className="middle box">
                <CompareButton
                    currentOption={active.option}
                    onSelect={(option) => {
                        chooseSelection1(active.option)
                        chooseSelection2(option)
                        setIsComparing(true)
                    }}
                />
   
                <HeartViewerPage
                    frameFolder={FRAMES[active.option]}
                    setSelectedPart={setSelectedPart}
                    title={HEART_STATE_TITLES[active.option]}
                    
                />
            </aside>
        )
    }

    // compare
    return (
        <>
            {selection1 && (
                <aside className="middle box compare-heart">

                    <CompareButton
                        currentOption={selection1}
                        onSelect={(option) => {chooseSelection1(option)}}
                    />
                    <button
                        type="button"
                        className="stop-compare-button"
                        onClick={() => stopComparing(selection1)}
                    >
                        Stop Comparing
                    </button>

                    <HeartViewerPage
                        frameFolder={FRAMES[selection1]}
                        setSelectedPart={setSelectedPart}
                        title={HEART_STATE_TITLES[selection1]}
                      
                        syncEnabled={syncEnabled}
                        syncedCameraRef={syncedCameraRef}
                        index={index}
                        sharedResetTrigger={sharedResetTrigger}
                        setSharedResetTrigger={setSharedResetTrigger}

                    />
                </aside>
            )}

            {selection2 && (
                <aside className="middle box compare-heart">

                    <CompareButton
                        currentOption={selection2}
                        onSelect={(option) => {
                            chooseSelection2(option)
                        }}
                    />
                    <button
                        type="button"
                        className="stop-compare-button"
                        onClick={() => stopComparing(selection2)}
                    >
                        Stop Comparing
                    </button>

                    <HeartViewerPage
                        frameFolder={FRAMES[selection2]}
                        setSelectedPart={setSelectedPart}
                        title={HEART_STATE_TITLES[selection2]}
                      
                      syncEnabled={syncEnabled}
                      syncedCameraRef={syncedCameraRef}
                      index={index}
                      sharedResetTrigger={sharedResetTrigger}
                      setSharedResetTrigger={setSharedResetTrigger}

                    />
                </aside>
            )}
        

            {isComparing &&
                <button
                    className="sync"
                    onClick={() => (setSyncEnabled((syncEnabled) => !syncEnabled))}
                    style={{
                        background: syncEnabled ? "#9e0000" : "#f5f5f5",
                        color: syncEnabled ? "#ffffff" : "black",
                    }}
                >
                    <p style={{fontSize: '20px', fontWeight: 500, margin: '0', paddingBottom: '2px'}}>
                        🗘
                    </p>
                    Sync
                </button>
            }
     </>

}
function CompareButton({currentOption, onSelect}: {currentOption: HeartOption, onSelect: (v: HeartOption) => void}) {
    const [isOpen, setIsOpen] = useState(false)
    const compareOptions: {label: string, option: HeartOption, category: HeartCategory}[] = [
            {label: "Healthy", option: "Normal", category: "healthy"},
            {label: "Minor Heart Attack", option: "Minor", category: "attack"},
            {label: "Severe Heart Attack", option: "Severe", category: "attack"},
            {label: "Fibrillation", option: "Fibrillation", category: "electricity"},
            {label: "Compensated Heart Failure",option: "Compensated",category: "failure"},
            {label: "Decompensated Heart Failure", option: "Decompensated", category: "failure"}
        ]

    return (
        <div className="compare-container">
            <button
                type="button"
                className="compare-button"
                onClick={() => setIsOpen(prev => !prev)}
            >
                Compare
                <span className="compare-arrow">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className="compare-dropdown">
                    {compareOptions.map(item => (
                        <button
                            type="button"
                            key={item.option}
                            className={`compare-option ${item.category} ${currentOption === item.option ? "selected" : ""}`}
                            onClick={() => {
                                onSelect(item.option)
                                setIsOpen(false)
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Content