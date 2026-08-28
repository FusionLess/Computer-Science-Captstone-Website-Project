import '../App.css'
import TopBar from '../components/TopBar'
import Content from '../components/Content'
import GraphBar from '../components/GraphBar'
import { useState } from 'react'

export default function HomePage() {
    const [active, setActive] = useState('healthy')

    return (
        <main className="app">
            <TopBar active={active} setActive={setActive} />
            <Content active={active} />
            <GraphBar />
        </main>
    )
}