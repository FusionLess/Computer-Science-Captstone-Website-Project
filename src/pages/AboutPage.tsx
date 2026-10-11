import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import AboutLayout from "./about/AboutLayout.tsx";
import type { Complexity } from '../components/types/complexities.ts';
import { useState } from 'react'

export default function AboutPage() {

    const [graphActive, setGraphActive] = useState<boolean>(true)
    const [glowActive, setGlowActive] = useState<boolean>(true)
    const [complexity, setComplexity] = useState<Complexity>("standard")
    const [showAdvancedSliceControls, setShowAdvancedSliceControls] = useState<boolean>(true)

    return (
        <main className="app">
            <TopBar graphActive={graphActive} setGraphActive={setGraphActive} glowActive={glowActive} setGlowActive={setGlowActive} complexity={complexity} setComplexity={setComplexity} showAdvancedSliceControls={showAdvancedSliceControls} setShowAdvancedSliceControls={setShowAdvancedSliceControls}/>
            <AboutLayout />
        </main>
    )
}