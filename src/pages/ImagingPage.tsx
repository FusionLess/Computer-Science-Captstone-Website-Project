import ImagingLayout from "../components/imaging/ImagingLayout.tsx"
import TopBar from "../components/layout/top_layout/TopBar.tsx";
import {useState} from "react";
import type { Complexity } from "../components/types/complexities.ts";

export default function ImagingPage() {
    const [graphActive, setGraphActive] = useState<boolean>(true)
    const [glowActive, setGlowActive] = useState(true)
    const [complexity, setComplexity] = useState<Complexity>("standard")

    return (
        <main className = "app">
            <TopBar
                graphActive={graphActive}
                setGraphActive={setGraphActive}
                glowActive={glowActive}
                setGlowActive={setGlowActive}
                complexity={complexity}
                setComplexity={setComplexity}
            />
            <ImagingLayout />
        </main>
    )
}
