import '../App.css'
import TopBar from '../components/layout/TopBar.tsx'
import Content from '../components/layout/Content.tsx'
import GraphBar from '../components/layout/GraphBar.tsx'
import { useState } from 'react'
import type {HeartState} from "../components/types/states.ts";

export default function HomePage() {
    const [active, setActive] = useState<HeartState>("healthy")

    return (
        <main className="app">
            <TopBar />
            <Content active={active} setActive={setActive} />
            <GraphBar />
        </main>
    )
}