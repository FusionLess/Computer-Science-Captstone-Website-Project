import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import Content from '../components/layout/middle_layout/Content.tsx'
import GraphBar from '../components/layout/bottom_layout/GraphBar.tsx'
import { useState } from 'react'
import type {HeartState} from "../components/types/states.ts";

export default function HomePage() {
    const [active, setActive] = useState<HeartState>({
        category: "healthy",
        option: "Healthy"
    });

    const [graphActive, setGraphActive] = useState<boolean>(true)

    return (
        <main className="app">
            <TopBar setGraphActive={setGraphActive} graphActive={graphActive}/>
            <Content active={active} setActive={setActive} />
            {graphActive && <GraphBar />}
        </main>
    )
}