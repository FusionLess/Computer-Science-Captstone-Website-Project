import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import Content from '../components/layout/middle_layout/Content.tsx'
import GraphBar from '../components/layout/bottom_layout/GraphBar.tsx'
import { useState } from 'react'
import type { HeartState } from "../components/types/states.ts";
import type { CompareState } from "../components/types/compare.ts"

export default function HomePage() {
    const [active, setActive] = useState<HeartState>({
        category: "healthy",
        option: "Healthy"
    });

    const [graphActive, setGraphActive] = useState<boolean>(true)

    const [isComparing, setIsComparing] = useState(false)

    const [selection1, chooseSelection1] = useState<HeartState>({
        category: "healthy",
        option: "Healthy",
    })

    const [selection2, chooseSelection2] = useState<HeartState>({
        category: "attack",
        option: "Minor",
    })

    const compareState: CompareState = {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    }

    return (
        <main className="app">
            <TopBar
                graphActive={graphActive}
                setGraphActive={setGraphActive}
            />
            <Content active={active} 
                setActive={setActive}
                compareState={compareState}
            />
            <GraphBar active={selection1} graphActive={graphActive} />
        </main>
    )
}