import { useState } from "react"
import ImagingSidePanel from "./ImagingSidePanel.tsx"
import type { ImagingMode } from "./imagingTypes.ts"
import "./ImagingLayout.css"
import MRIPanel from "./mri/MRIPanel.tsx";
import EchoPanel from "./echo/EchoPanel.tsx";

export default function ImagingLayout() {
    const [viewerMode, setViewerMode] = useState<ImagingMode>("mri")

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

