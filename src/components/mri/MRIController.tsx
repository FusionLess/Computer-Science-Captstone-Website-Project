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
            <div style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                background: 'rgba(20, 20, 25, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '14px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: 'min(90vw, 520px)'
            }}>
                {/* Slice Selector */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ color: 'white', fontSize: 13, minWidth: '90px' }}>
                        Slice: {slice + 1} / {totalSlices}
                        </span>
                    <input
                        type="range"
                        min={0}
                        max={totalSlices - 1}
                        value={slice}
                        onChange={(e) => setSlice(Number(e.target.value))}
                        style={{ flex: 1, cursor: 'pointer' }}
                    />
                </div>

                {/* Temporal Frame & Play/Pause Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: isPlaying ? '#e11d48' : '#16a34a',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            minWidth: '65px'
                        }}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>

                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, minWidth: '85px' }}>
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
                        style={{ flex: 1, cursor: 'pointer' }}
                    />
                </div>
            </div>
        </>
    )
}