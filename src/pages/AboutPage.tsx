import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import AboutLayout from "../components/about/AboutLayout.tsx";
import { useState } from 'react'

export default function HomePage() {

    const [graphActive, setGraphActive] = useState<boolean>(true)

    return (
        <main className="app">
            <TopBar graphActive={graphActive} setGraphActive={setGraphActive}/>
            <AboutLayout />
        </main>
    )
}