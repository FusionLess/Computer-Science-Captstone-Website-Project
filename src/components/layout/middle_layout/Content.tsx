    import "./Content.css"
    import LeftBox from "./LeftPanel.tsx"
    import type {HeartOption, HeartState} from "../../types/states.ts";
    import HealthyHeart from "../../hearts/HealthyHeart.tsx";
    import MinorAttack from "../../hearts/MinorAttack.tsx";
    import SevereAttack from "../../hearts/SevereAttack.tsx"
    import FibrillatingHeart from "../../hearts/FibrillatingHeart.tsx";
    import RightBox from "./RightPanel.tsx";
    import CompensatedHeart from "../../hearts/CompensatedHeart.tsx";
    import DecompensatedHeart from "../../hearts/DecompensatedHeart.tsx";
    import { useState } from "react";
    import type { CompareState } from "../../types/compare.ts"

function Content({active, setActive} : {active: HeartState, setActive: (v: HeartState) => void}) {
    const [isComparing, setIsComparing] = useState<boolean>(false);
    const [selection1, chooseSelection1] = useState<HeartOption>(null)
    const [selection2, chooseSelection2] = useState<HeartOption>(null)

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
            <MiddleBox active={active} compareState={compareState}/>
            <RightBox />
        </main>
    )
}

const views = {
    Normal: <HealthyHeart/>,
    Minor: <MinorAttack/>,
    Severe: <SevereAttack/>,
    Fibrillation: <FibrillatingHeart/>,
    Compensated: <CompensatedHeart/>,
    Decompensated: <DecompensatedHeart/>
};

function MiddleBox({active, compareState} : {active: HeartState, compareState: CompareState}) {

    const {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    } = compareState;

    return (
        <>
            <aside className="middle box">
                {!isComparing && views[active.option]}
                {isComparing && views[selection1]}
            </aside>

            {isComparing && <aside className="middle box">
                {views[selection2]}
            </aside>}
        </>
    )
}


export default Content