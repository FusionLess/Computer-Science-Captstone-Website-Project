    import "./Content.css"

    import type { HeartState } from "../../types/states.ts";
    import type { CompareState } from "../../types/compare.ts"

    import { useEffect, useState } from "react";

    import LeftBox from "./LeftPanel.tsx"
    import MiddlePanel from "./MiddlePanel.tsx"
    import RightBox from "./RightPanel.tsx";
  
function Content({compareState} :
                 {active: HeartState, setActive: (v: HeartState) => void, compareState: CompareState}) {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    useEffect(() => {
        setSelectedPart(null);
    }, [
        compareState.selection1,
            compareState.selection2,
            compareState.isComparing,
    ])

    return (
        <main className="content">
            <LeftBox compareState={compareState}/>
            <MiddlePanel compareState={compareState} setSelectedPart={setSelectedPart}/>
            <RightBox compareState={compareState} selectedPart={selectedPart} />
        </main>
    )
}

export default Content