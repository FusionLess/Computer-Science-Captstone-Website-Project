import type { ImagingMode } from "./imagingTypes.ts"

type LeftImagingPanelProps = {
    viewerMode: ImagingMode
    setViewerMode: (mode: ImagingMode) => void
}

const imagingDescriptions = {
    "mri" : "MRI stands for magnetic resonance imaging. It uses strong magnetic fields and radio waves to create detailed images of organs and tissues inside your body. These images help doctors investigate symptoms, diagnose conditions and monitor how well treatment is working.",
    "echo" : "An echocardiogram, often called an echo, is an ultrasound scan that uses high-frequency sound waves to create moving images of your heart. It shows the heart’s structure, including its chambers and valves, and helps doctors assess how well it is pumping blood. For a standard echo, a small handheld probe is moved across your chest to capture the images."
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
        </aside>
    )
}
