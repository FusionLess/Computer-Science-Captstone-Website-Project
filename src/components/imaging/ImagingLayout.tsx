import { useState } from "react"
import {useNavigate, useParams} from "react-router"
import ImagingSidePanel from "./ImagingSidePanel.tsx"
import type { ImagingMode } from "./imagingTypes.ts"
import "./ImagingLayout.css"
import MRIPanel from "./mri/MRIPanel.tsx";
import EchoPanel from "./echo/EchoPanel.tsx";

export default function ImagingLayout() {
    const navigate = useNavigate()
    const { mode } = useParams<{ mode: string }>()

    
    const viewerMode: ImagingMode = mode === "echo" ? "echo" : "mri"

    const setViewerMode = (newMode: ImagingMode) => {
        navigate(`/imaging/${newMode}`)
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

