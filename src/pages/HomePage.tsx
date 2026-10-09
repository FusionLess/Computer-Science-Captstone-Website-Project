import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import Content from '../components/layout/middle_layout/MiddleContent.tsx'
import GraphPanel from '../components/layout/bottom_layout/GraphPanel.tsx'
import { useEffect, useRef, useState } from 'react'
import type { HeartState } from "../components/types/states.ts";
import type { CompareState } from "../components/types/compare.ts"
import type { Complexity } from '../components/types/complexities.ts'

export default function HomePage() {
    const [active, setActive] = useState<HeartState>({
        category: "healthy",
        option: "Healthy"
    });

    const [graphActive, setGraphActive] = useState<boolean>(true)
    const [glowActive, setGlowActive] = useState(true)

    const [isComparing, setIsComparing] = useState(false)

    const [selection1, chooseSelection1] = useState<HeartState>({
        category: "healthy",
        option: "Healthy",
    })

    const [selection2, chooseSelection2] = useState<HeartState>({
        category: "healthy",
        option: "Healthy",
    })
    const [complexity, setComplexity] =
        useState<Complexity>("standard")

    const compareState: CompareState = {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    }

    const [showDescriptions, setShowDescriptions] = useState(true)
    const descriptionsBeforeCompare = useRef(showDescriptions)

    useEffect(() => {
        if (isComparing) {
            descriptionsBeforeCompare.current = showDescriptions
            setShowDescriptions(false)
            return
        }

        setShowDescriptions(descriptionsBeforeCompare.current)
    }, [isComparing])

    return (
        <main className="app">
            <TopBar
                graphActive={graphActive}
                setGraphActive={setGraphActive}
                glowActive={glowActive}
                setGlowActive={setGlowActive}
                complexity={complexity}
                setComplexity={setComplexity}
                showDescriptions={showDescriptions}
                setShowDescriptions={setShowDescriptions}
            />
            <Content active={active} 
                setActive={setActive}
                compareState={compareState}
                complexity={complexity}
                showDescriptions={showDescriptions}
            />
            <GraphPanel compareState={compareState} graphActive={graphActive} glowActive={glowActive} />
        </main>
    )
}
