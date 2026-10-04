import { useEffect, useState, useMemo } from "react"
import MRIViewer from "./MRIViewer.tsx"
import "./MRILayout.css"
import HeartViewer from "../hearts/HeartViewer"
import MRIController from "./MRIController.tsx"
import { useHeartMonitor } from "../context/HeartMonitorContext.tsx"
import * as THREE from 'three'
import { HEART_FRAME_COUNT } from '../hearts/heartRendering'

export default function MRILayout() {

    const [slice, setSlice] = useState<number>(5);
    const [frame, setFrame] = useState<number>(0);
    const { bpm, isPaused, setIsPaused } = useHeartMonitor();
    const isPlaying = !isPaused;
    const setIsPlaying = (value: boolean) => setIsPaused(!value);

    const totalSlices = 10;
    const totalFrames = 30;
    const heartFrameOffset = 20;
    const modelFrameOffset = 18;

    useEffect(() => {
        if (!isPlaying || bpm <= 0) return;

        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % totalFrames);
        }, 60000 / bpm / totalFrames);

        return () => clearInterval(interval);
    }, [isPlaying, bpm, totalFrames]);

    const mriClipPlane = useMemo(() => {
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


    return (
            <main className="mri-page-layout">
                <div className="mri-controller">
                    <MRIController
                        slice={slice}
                        totalSlices={totalSlices}
                        setSlice={setSlice}
                        frame={frame}
                        totalFrames={totalFrames}
                        setFrame={setFrame}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}/>
                </div>
                <div className="heart-mri-container">
                    <div className="heart-container">
                        <HeartViewer
                            frameFolder="frames"
                            showControls={false}
                            mriClipPlane={mriClipPlane}
                            animationPhase={
                                ((frame + heartFrameOffset) / totalFrames
                                    + modelFrameOffset / HEART_FRAME_COUNT) % 1
                            }
                        />
                    </div>
                    <div className="mri-container">
                        <MRIViewer slice={slice} frame={frame} totalFrames={totalFrames}/>
                    </div>
                </div>
            </main>
    )
}
