import { useState } from 'react'
import TopBar from '../components/layout/top_layout/TopBar'
import EchoViewer from '../components/echo/EchoViewer'

export default function EchoPage() {
    const [graphActive, setGraphActive] = useState(true)
    const [glowActive, setGlowActive] = useState(false)

    return (
        <>
            <TopBar
                graphActive={graphActive}
                setGraphActive={setGraphActive}
                glowActive={glowActive}
                setGlowActive={setGlowActive}
            />
            <EchoViewer />
        </>
    )
}
