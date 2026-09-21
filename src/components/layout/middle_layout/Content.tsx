    import "./Content.css"

    import type {HeartOption, HeartState} from "../../types/states.ts";
    import type { CompareState } from "../../types/compare.ts"

    import { FRAMES } from "../../types/frames.ts"
    import { useEffect, useState, useRef } from "react";

    import HeartViewer from "../../hearts/HeartViewer.jsx"
    import LeftBox from "./LeftPanel.tsx"
    import RightBox from "./RightPanel.tsx";

function Content({active, setActive, compareState} : {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState}) {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    useEffect(() => {
        setSelectedPart(null);
    }, [active.category, active.option]);

    return (
        <main className="content">
            <LeftBox active={active} setActive={setActive} compareState={compareState}/>
            <MiddleBox active={active} compareState={compareState} setSelectedPart={setSelectedPart}/>
            <RightBox active={active} compareState={compareState} selectedPart={selectedPart} />
        </main>
    )
}


function MiddleBox({active, compareState, setSelectedPart} : {active: HeartState, compareState: CompareState, setSelectedPart: (part: string | null) => void}) {

    const {selection1, selection2, isComparing,} = compareState;

    const [syncEnabled, setSyncEnabled] = useState(false)
    const syncedCameraRef = useRef<{
        position: [number, number, number]
        target: [number, number, number]
        zoom: number
    } | null>(null)
    const [sharedResetTrigger, setSharedResetTrigger] = useState(0)

    const heartsToShow = isComparing ? [selection1, selection2] : [active.option]

    return (
        <div className="middle box">
            {heartsToShow.map((option : HeartOption, index) => {
                if (!option) return null;

                return (
                    <aside className="heart" key={`${option}-${index}`}>
                        <HeartViewer
                            frameFolder={FRAMES[option]}
                            setSelectedPart={setSelectedPart}
                            syncEnabled={syncEnabled}
                            syncedCameraRef={syncedCameraRef}
                            index={index}
                            sharedResetTrigger={sharedResetTrigger}
                            setSharedResetTrigger={setSharedResetTrigger}
                        />
                    </aside>
                );
            })}
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
        </div>
    )
}


export default Content