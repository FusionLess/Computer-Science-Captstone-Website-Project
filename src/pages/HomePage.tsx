import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import Content from '../components/layout/middle_layout/Content.tsx'
import GraphBar from '../components/layout/bottom_layout/GraphBar.tsx'
import { useState } from 'react'
import type {HeartState} from "../components/types/states.ts";

export default function HomePage() {
    const [active, setActive] = useState<HeartState>({
        category: "healthy",
        option: "Normal"
    });
    const [selectedPart, setSelectedPart] = useState<string | null>(null)
    return (
        <main className="app">
            <TopBar />
            <Content active={active} 
            setActive={setActive} 
            selectedPart={selectedPart} 
            setSelectedPart={setSelectedPart}  
            />
            <GraphBar />
        </main>
    )
}