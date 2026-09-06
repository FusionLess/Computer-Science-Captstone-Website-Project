import "./GraphBar.css"
import { GRAPH_BEAT_COUNT, useHeartMonitor } from "../context/HeartMonitorContext.tsx"

const BEAT_COUNT = GRAPH_BEAT_COUNT
const VIEWBOX_WIDTH = 500

export default function GraphBar() {
    const { bpm, graphPhase } = useHeartMonitor()

    return (
        <footer className="graphs">
            <ICUContainer phase={graphPhase} type="ecg" d={generateECGPath()} />
            <HeartRateContainer bpm={bpm} />
            <ICUContainer phase={graphPhase} type="pressure" d={generatePressurePath()} />
        </footer>
    )
}

/*
Absolute (Capital Letters)
M x y              move to exact grid coordinates without drawing
L x y              draw a straight line to exact grid coordinates
H x                draw horizontally to an exact X coordinate
V y                draw vertically to an exact Y coordinate
C x1 y1 x2 y2 x y  cubic Bézier curve using absolute grid coordinates

x1 y1 (First Control Point): Dictates the angle and pull of the curve as it leaves your starting point.
x2 y2 (Second Control Point): Dictates the angle and pull of the curve as it approaches your landing point.
x y (Destination Point): The exact absolute grid coordinate where the line finishes drawing.

{ x + w * a }
a = a percentage of progress across that one beat
 */

function generateECGPath() {
    let fullD = "M 0 117 "
    for (let i = 0; i < BEAT_COUNT; i++) {
        const x = i * (VIEWBOX_WIDTH / BEAT_COUNT)
        const w = VIEWBOX_WIDTH / BEAT_COUNT

        /*
        Segments for waves below
        P-wave

        QRS interval

        T interval

        TP interval
         */

        fullD += `
            L ${x + w * 0.06} 117
            C ${x + w * 0.08} 116, ${x + w * 0.12} 107, ${x + w * 0.17} 107
            C ${x + w * 0.18} 107, ${x + w * 0.20} 117, ${x + w * 0.22} 118
            C ${x + w * 0.24} 116, ${x + w * 0.25} 119, ${x + w * 0.28} 118
            
            L ${x + w * 0.30} 125
            L ${x + w * 0.33} 13     
            L ${x + w * 0.36} 138
            C ${x + w * 0.37} 134, ${x + w * 0.38} 130, ${x + w * 0.39} 121
            
            C ${x + w * 0.44} 120, ${x + w * 0.46} 116, ${x + w * 0.52} 116
            C ${x + w * 0.54} 113, ${x + w * 0.56} 111, ${x + w * 0.57} 110
            C ${x + w * 0.60} 105, ${x + w * 0.62} 101, ${x + w * 0.63} 101
            C ${x + w * 0.65} 101, ${x + w * 0.70} 111, ${x + w * 0.74} 117
            
            L ${x + w * 0.78} 117
            C ${x + w * 0.81} 119, ${x + w * 0.83} 115, ${x + w * 0.84} 117
            C ${x + w * 0.86} 117, ${x + w * 0.94} 117, ${x + w} 115
        `
    }
    return fullD
}

function generatePressurePath() {
    let fullD = "M 0 115 "
    for (let i = 0; i < BEAT_COUNT; i++) {
        const x = i * (VIEWBOX_WIDTH / BEAT_COUNT)
        const w = VIEWBOX_WIDTH / BEAT_COUNT
        fullD += `
            C ${x + w * 0.1} 113,  ${x + w * 0.2} 116,   ${x + w * 0.32} 111
            C ${x + w * 0.38} 107,  ${x + w * 0.40} 75,   ${x + w * 0.46} 66
            C ${x + w * 0.50} 53,  ${x + w * 0.54} 35,   ${x + w * 0.66} 22
            C ${x + w * 0.68} 23,  ${x + w * 0.70} 25,   ${x + w * 0.72} 46
            C ${x + w * 0.76} 71,  ${x + w * 0.80} 99,   ${x + w * 0.86} 118
            C ${x + w * 0.92} 123,  ${x + w * 0.96} 120,   ${x + w } 118
        `
    }
    return fullD
}

function ICUContainer({ phase, type, d }: { phase: number; type: 'ecg' | 'pressure'; d: string }) {
    const safePhase = isNaN(phase) ? 0 : phase
    const xPos = safePhase * 100

    return (
        <div className={`${type} container`}>
            {type === 'pressure' && (
                <div className="pressure-scale">
                    <span>120</span>
                    <span className="pressure-unit">mmHg</span>
                    <span>0</span>
                </div>
            )}
            <div style={{ position: 'relative', width: '100%', height: '100%', flex: 1, overflow: 'hidden' }}>
                <svg className="monitor-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} 150`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                    <path d={d} className={`${type}-waveform`} />
                </svg>

                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${xPos}%`,
                        width: '0.15%',
                        background: 'darkred',
                        opacity: 0.98,
                        pointerEvents: 'none',
                        transition: 'none',
                        borderRadius: '20px',
                    }}
                />
            </div>
        </div>
    )
}

function HeartRateContainer({ bpm }: { bpm: number }) {
    return (
        <div className="heartrate container">
            <span className="heart-rate-label">HEART RATE</span>
            <strong className="heart-rate-value">{bpm}</strong>
            <span className="heart-rate-label">BPM</span>
        </div>
    )
}