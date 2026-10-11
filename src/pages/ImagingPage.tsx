import ImagingLayout from "./imaging/ImagingLayout.tsx"
import TopBar from "../components/layout/top_layout/TopBar.tsx";
import {useState} from "react";
import type { Complexity } from "../components/types/complexities.ts";

export default function ImagingPage() {
    const [graphActive, setGraphActive] = useState<boolean>(true)
    const [glowActive, setGlowActive] = useState(true)
    const [complexity, setComplexity] = useState<Complexity>("standard")
    const [showAdvancedSliceControls, setShowAdvancedSliceControls] = useState<boolean>(true)

    return (
        <main className = "app">
            <TopBar
                graphActive={graphActive}
                setGraphActive={setGraphActive}
                glowActive={glowActive}
                setGlowActive={setGlowActive}
                complexity={complexity}
                setComplexity={setComplexity}
                showAdvancedSliceControls={showAdvancedSliceControls}
                setShowAdvancedSliceControls={setShowAdvancedSliceControls}
            />
            <ImagingLayout />
        </main>
    )
}
