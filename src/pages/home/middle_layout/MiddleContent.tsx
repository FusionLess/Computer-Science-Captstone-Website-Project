import "./MiddleContent.css"

import type { HeartState } from "../../../components/types/states.ts";
import type { CompareState } from "../../../components/types/compare.ts"

import { useEffect, useState } from "react";
import LeftBox from "./ConditionDes.tsx"
import HeartController2 from "./HeartController2.tsx"
import RightBox from "./DescriptionPanel.tsx";
import type { Complexity } from "../../../components/types/complexities.ts";

function Content({ compareState, complexity, showDescriptions, showAdvancedSliceControls } :
                 { active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState, complexity: Complexity, showDescriptions: boolean, showAdvancedSliceControls: boolean, }) {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    useEffect(() => {
        setSelectedPart(null);
    }, [
        compareState.selection1,
        compareState.selection2,
        compareState.isComparing,
        complexity,
    ])

    return (
        <main className={`content${showDescriptions ? "" : " descriptions-hidden"}`}>
            {showDescriptions && (<LeftBox compareState={compareState} complexity={complexity} />)}
            <HeartController2 compareState={compareState} setSelectedPart={setSelectedPart} complexity={complexity} showAdvancedSliceControls={showAdvancedSliceControls}/>
            {showDescriptions && (<RightBox compareState={compareState} selectedPart={selectedPart} complexity={complexity}/>)}
        </main>
    )
}

export default Content
