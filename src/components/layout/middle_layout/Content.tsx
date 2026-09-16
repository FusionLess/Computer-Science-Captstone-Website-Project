    import "./Content.css"

    import type {HeartOption, HeartState} from "../../types/states.ts";
    import type { CompareState } from "../../types/compare.ts"

    import { FRAMES } from "../../types/FRAMES.ts"
    import { useState } from "react";

    import HeartViewerPage from "../../hearts/HeartViewer.jsx"
    import LeftBox from "./LeftPanel.tsx"
    import RightBox from "./RightPanel.tsx";

function Content({active, setActive} : {active: HeartState, setActive: (v: HeartState) => void}) {
    const [isComparing, setIsComparing] = useState<boolean>(false);
    const [selection1, chooseSelection1] = useState<HeartOption | null>(null); 
    const [selection2, chooseSelection2] = useState<HeartOption | null>(null);
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const compareState: CompareState = {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing
    };

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

    const heartsToShow = isComparing ? [selection1, selection2] : [active.option]

    return (
        <>
            {heartsToShow.map((option : HeartOption, index) => {
                if (!option) return null;

                return (
                    <aside className="middle box" key={`${option}-${index}`}>
                        <HeartViewerPage frameFolder={FRAMES[option]} setSelectedPart={setSelectedPart} />
                    </aside>
                );
            })}
        </>
    )
}


export default Content