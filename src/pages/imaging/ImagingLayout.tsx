import {useNavigate, useParams} from "react-router"
import { useRef } from "react"
import ImagingSidePanel from "./ImagingSidePanel.tsx"
import type { ImagingMode } from "./imagingTypes.ts"
import "./ImagingLayout.css"
import MRIPanel from "./mri/MRIPanel.tsx";
import EchoPanel from "./echo/EchoPanel.tsx";

export default function ImagingLayout() {
    const navigate = useNavigate()
    const { mode } = useParams<{ mode: string }>()
    const isNavigating = useRef(false)

    
    const viewerMode: ImagingMode = mode === "echo" ? "echo" : "mri"

    const setViewerMode = (newMode: ImagingMode) => {
        if (newMode === viewerMode || isNavigating.current) return

        isNavigating.current = true

        window.setTimeout(() => {
            navigate(`/imaging/${newMode}`)
            window.requestAnimationFrame(() => {
                isNavigating.current = false
            })
        }, 50)
    }

    return (
        <main className="imaging-layout">
            <div className = "imaging-left-box">
                <ImagingSidePanel viewerMode={viewerMode} setViewerMode={setViewerMode} />
            </div>
            <div className="imaging-main-box">
                <section className="imaging-central-panel">
                    {viewerMode === "mri" ? <MRIPanel /> : <EchoPanel />}
                </section>
            </div>
        </main>
    )
}

