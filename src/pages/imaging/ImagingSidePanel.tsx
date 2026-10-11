import type { ImagingMode } from "./imagingTypes.ts"

type LeftImagingPanelProps = {
    viewerMode: ImagingMode
    setViewerMode: (mode: ImagingMode) => void
}

const imagingDescriptions = {
    "mri" : "MRI Stands for Magnetic Resonance Imaging. MRI Scans uses strong magnetic and radio waves to create clear images of inside your body",
    "echo" : "Echocardiography, or echocardiograms, is a non-invasive ultrasound test to produce images from within your body. It uses high frequency sound waves to create moving pictures of your heart's structure including its valves and chambers."
}

export default function ImagingSidePanel({ viewerMode, setViewerMode }: LeftImagingPanelProps) {
    return (
        <aside className="imaging-side-panel">
            <h1>Imaging</h1>
            <div className="imaging-mode-switch">
                <button type="button" aria-pressed={viewerMode === "mri"} onClick={() => setViewerMode("mri")}>MRI</button>
                <button type="button" aria-pressed={viewerMode === "echo"} onClick={() => setViewerMode("echo")}>Echo</button>
            </div>
            <div className="imaging-description">
                {imagingDescriptions[viewerMode]}
            </div>
            <div className="imaging-side-panel-extra">Additional information</div>
        </aside>
    )
}
