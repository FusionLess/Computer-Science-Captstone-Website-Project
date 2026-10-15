import "./MRIPanel.css"
import { useEffect, useState, useMemo, useId } from "react"
import MRIViewer from "./MRIViewer.tsx"
import HeartViewer from "../../../components/hearts/HeartViewer"
import { useHeartMonitor } from "../../../components/context/HeartMonitorContext.tsx"
import * as THREE from 'three'
import { HEART_FRAME_COUNT } from '../../../components/hearts/heartRendering'

export default function MRIPanel() {
    const sliceSliderId = useId();

    const [slice, setSlice] = useState<number>(5);
    const [frame, setFrame] = useState<number>(0);
    const { isPaused, setIsPaused } = useHeartMonitor();
    const bpm = 60;
    const isPlaying = !isPaused;
    const setIsPlaying = (value: boolean) => setIsPaused(!value);

    const totalSlices = 10;
    const totalFrames = 30;
    const heartFrameOffset = 0;
    const modelFrameOffset = 23;

    useEffect(() => {
        if (!isPlaying || bpm <= 0) return;

        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % totalFrames);
        }, 60000 / bpm / totalFrames);

        return () => clearInterval(interval);
    }, [isPlaying, bpm, totalFrames]);

    const externalClipPlane = useMemo(() => {
        const firstSliceY = 20
        const lastSliceY = -45

        const progress = totalSlices > 1
            ? slice / (totalSlices - 1)
            : 0

        const sliceY = THREE.MathUtils.lerp(
            firstSliceY,
            lastSliceY,
            progress
        )

        return new THREE.Plane(
            new THREE.Vector3(0, -1, 0),
            sliceY
        )
    }, [slice, totalSlices])

    const [heartView, setHeartView] = useState("tiltedShortAxis");
    const [heartViewResetTrigger, setHeartViewResetTrigger] = useState(0);

    const selectHeartView = (view: string) => {
        setHeartView(view);
        setHeartViewResetTrigger(value => value + 1);
    };

    return (
        <section className="mri-panel">
            <h2>MRI</h2>
            <div className="mri-panel-viewers">
                <div className="mri-panel-viewer">
                    <span>Heart viewer</span>
                    <div className="mri-panel-viewer-content heart-viewer">
                        <div className="slice-bar">
                            <div className="heart-view-buttons" role="group" aria-label="Heart camera views">
                                {[
                                    { view: "topDown", label: "Top" },
                                    { view: "frontal", label: "Front" },
                                    { view: "tiltedShortAxis", label: "Default" },
                                ].map(({ view, label }) => (
                                    <button
                                        key={view}
                                        type="button"
                                        title={`Restore ${label.toLowerCase()} view`}
                                        aria-pressed={heartView === view}
                                        onClick={() => selectHeartView(view)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <label className="slice-label" htmlFor={sliceSliderId}>
                                Slice {slice + 1} of {totalSlices}
                            </label>
                            <input
                                id={sliceSliderId}
                                type="range"
                                min={0}
                                max={totalSlices - 1}
                                value={totalSlices - 1 - slice}
                                onChange={(e) => setSlice(totalSlices - 1 - Number(e.target.value))}
                                className="slice-button"
                            />
                        </div>
                        <HeartViewer
                            cameraView={heartView}
                            cameraViewResetTrigger={heartViewResetTrigger}
                            frameFolder="frames"
                            showControls={false}
                            externalClipPlane={externalClipPlane}
                            animationPhase={((frame + heartFrameOffset) / totalFrames
                                + modelFrameOffset / HEART_FRAME_COUNT) % 1} setSelectedPart={undefined}
                            title={undefined} syncEnabled={undefined} syncedCameraRef={undefined} index={undefined}
                            sharedResetTrigger={undefined} setSharedResetTrigger={undefined}
                            useSharedControls={undefined} showSyncedControls={undefined} sharedShowEpi={undefined}
                            setSharedShowEpi={undefined} sharedVentricleOnly={undefined}
                            setSharedVentricleOnly={undefined} sharedFullView={undefined} setSharedFullView={undefined}
                            sharedSliceEnabled={undefined} setSharedSliceEnabled={undefined}
                            sharedShowPlaneGuide={undefined} setSharedShowPlaneGuide={undefined}
                            sharedActivePreset={undefined} setSharedActivePreset={undefined} sharedPitch={undefined}
                            setSharedPitch={undefined} sharedYaw={undefined} setSharedYaw={undefined}
                            sharedSliceDistance={undefined} setSharedSliceDistance={undefined} complexity={undefined}
                            showAdvancedSliceControls={undefined}                        />
                    </div>
                </div>
                <div className="mri-panel-viewer">
                    <span>MRI viewer</span>
                    <div className="mri-panel-viewer-content mri-viewer">
                        <MRIViewer slice={slice} frame={frame} totalFrames={totalFrames}/>
                    </div>
                </div>
            </div>

            <div className="mri-panel-controls">
                <div className="controller-row">
                    <span className="frame-label">
                        Frame: {frame + 1} / {totalFrames}
                    </span>

                    <input
                        type="range"
                        min={0}
                        max={totalFrames - 1}
                        value={frame}
                        onChange={(e) => {
                            setIsPlaying(false);
                            setFrame(Number(e.target.value));
                        }}
                        className="frame-slider"
                    />
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={isPlaying ? 'pause-button' : 'play-button'}
                        aria-pressed={isPlaying}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>

        </section>
    )
}

