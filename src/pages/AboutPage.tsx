import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import AboutLayout from "../components/about/AboutLayout.tsx";
import type { Complexity } from '../components/types/complexities.ts';
import { useState } from 'react'

export default function AboutPage() {

    const [graphActive, setGraphActive] = useState<boolean>(true)
    const [complexity, setComplexity] = useState<Complexity>("standard")

    return (
        <main className="app">
            <TopBar graphActive={graphActive} setGraphActive={setGraphActive} complexity={complexity} setComplexity={setComplexity}/>
            <AboutLayout />
        </main>
    )
}