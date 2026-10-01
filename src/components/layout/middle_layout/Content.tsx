    import "./Content.css"

    import type { HeartState } from "../../types/states.ts";
    import type { CompareState } from "../../types/compare.ts"

    import { useEffect, useState } from "react";

    import LeftBox from "./LeftPanel.tsx"
    import MiddlePanel from "./MiddlePanel.tsx"
    import RightBox from "./RightPanel.tsx";
    import type { Complexity } from "../../types/complexities.ts";
  
function Content({compareState, complexity} :
                 {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState, complexity: Complexity}) {
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
        <main className="content">
            <LeftBox compareState={compareState} complexity={complexity} />
            <MiddlePanel compareState={compareState} setSelectedPart={setSelectedPart} complexity={complexity}/>
            <RightBox compareState={compareState} selectedPart={selectedPart} complexity={complexity}/>
        </main>
    )
}

export default Content