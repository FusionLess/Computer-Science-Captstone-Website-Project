import { useEffect, useState, useMemo } from "react"
import MRIViewer from "./MRIViewer.tsx"
import "./MRILayout.css"
import HeartViewer from "../hearts/HeartViewer"
import MRIController from "./MRIController.tsx"
import * as THREE from 'three'

export default function MRILayout() {

    const [slice, setSlice] = useState<number>(5);
    const [frame, setFrame] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    const totalSlices = 10;
    const totalFrames = 30;

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % totalFrames);
        }, 50);

        return () => clearInterval(interval);
    }, [isPlaying, totalFrames]);

    const mriClipPlane = useMemo(() => {
        const firstSliceY = 40
        const lastSliceY = -40

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
        <main className="mri-layout">
            <div className="heart-container" >
                <HeartViewer frameFolder="frames" showControls={false} mriClipPlane={mriClipPlane} />
            </div>
            <div className="mri-container" >
                <MRIViewer slice={slice} frame={frame} totalFrames={totalFrames} />
            </div>
            <div className="mri-controller">
                <MRIController
                    slice={slice}
                    totalSlices={totalSlices}
                    setSlice={setSlice}
                    frame={frame}
                    totalFrames={totalFrames}
                    setFrame={setFrame}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
            </div>
        </main>
    )
}
