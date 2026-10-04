import "./MRIController.css"

type MRIControllerProps = {
    slice: number
    totalSlices: number
    setSlice: (value: number) => void
    frame: number
    totalFrames: number
    setFrame: (value: number) => void
    isPlaying: boolean
    setIsPlaying: (value: boolean) => void
}

export default function MRIController({
        slice,
        totalSlices,
        setSlice,
        frame,
        totalFrames,
        setFrame,
        isPlaying,
        setIsPlaying,
}: MRIControllerProps) {

    return (
        <>
            <div className="controller-panel">
                {/* Slice Selector */}
                <div className="controller-row">
                    <span className="slice-label">
                        Slice: {slice + 1} / {totalSlices}
                        </span>
                    <input
                        type="range"
                        min={0}
                        max={totalSlices - 1}
                        value={slice}
                        onChange={(e) => setSlice(Number(e.target.value))}
                        className="slice-button"
                    />
                </div>

                {/* Temporal Frame & Play/Pause Controls */}
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
                        className="frame-button"
                    />
                </div>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={isPlaying ? 'pause-button' : 'play-button'}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
        </>
    )
}
