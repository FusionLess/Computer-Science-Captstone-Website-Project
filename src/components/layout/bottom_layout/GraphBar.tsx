import "./GraphBar.css"
import { GRAPH_BEAT_COUNT, useHeartMonitor } from "../../context/HeartMonitorContext.tsx"
import { ecgProfiles, type ECGProfile } from "../../../data/ECGParameters.ts"
import type { HeartState } from "../../types/states.ts"

const BEAT_COUNT = GRAPH_BEAT_COUNT
const VIEWBOX_WIDTH = 500

type GraphBarProps = {
    active: HeartState
}

export default function GraphBar({ active }: GraphBarProps) {
    const { bpm, graphPhase } = useHeartMonitor()
    const getECGProfile = () => {
        switch (active.option) {
            case "Normal":
                return ecgProfiles.healthy

            case "Minor":
                return ecgProfiles.minorAttack

            case "Severe":
                return ecgProfiles.severeAttack

            case "Fibrillation":
                return ecgProfiles.fibrillation

            case "Compensated":
                return ecgProfiles.compensated

            case "Decompensated":
                return ecgProfiles.decompensated

            default:
                return ecgProfiles.healthy
        }
    }

    const profile = getECGProfile()
    return (
        <footer className="graphs">
            <ICUContainer
                phase={graphPhase}
                type="ecg"
                d={generateECGPath(ecgProfiles.healthy)}
                overlayD={profile.severity !== "healthy"  ? generateECGPath(profile) : undefined}
                severity={profile.severity !== "healthy" ? profile.severity : undefined}
            />
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
function generateECGPath(profile: ECGProfile) {
    let fullD = "M 0 117 "
    for (let i = 0; i < BEAT_COUNT; i++) {
        const x = i * (VIEWBOX_WIDTH / BEAT_COUNT)
        const w = VIEWBOX_WIDTH / BEAT_COUNT

        const postQrsWobble = 8 * profile.rhythmJitter

        const baseline = 117

        // Wave amplitudes
        const pY = baseline - 10 * profile.pAmp
        const rY = baseline - 104 * profile.qrsAmp 
        const sY = baseline + 21 * profile.sAmp

        const stY = baseline - 24 * profile.stElevation
        const elevatedY = baseline - 35 * profile.stElevation

        // T wave
        const tDirection = profile.tInverted ? 1 : -1
        const tY = baseline + tDirection * 16 * profile.tAmp 

        // QRS timing
        const qrsStart = 0.30 + profile.qrsOffset
        const qrsPeak = qrsStart + 0.03 * profile.qrsWidth
        const qrsEnd = qrsStart + 0.06 * profile.qrsWidth

        // ST timing changes depending on whether QRS is shown
        const stStart = profile.qrsStyle === "none" ? 0.33 : qrsEnd + 0.07
        const stEnd = stStart + 0.16 * profile.stDuration

        // T wave timing
        const tPeak = stEnd + 0.09 * profile.tStartOffset
        const tEnd = stEnd + 0.20 * profile.tWidth

        // P wave
        fullD += `
            L ${x + w * 0.06} ${baseline}
            C ${x + w * 0.08} ${baseline - 1},  ${x + w * 0.12} ${pY}, ${x + w * 0.17} ${pY}
            C ${x + w * 0.18} ${pY},  ${x + w * 0.20} ${baseline},  ${x + w * 0.22} ${baseline + 1}
        `

        // QRS complex
        if (profile.qrsStyle === "normal") {
            fullD += `
                L ${x + w * qrsStart} ${baseline + 8}
                L ${x + w * qrsPeak} ${rY}
                L ${x + w * qrsEnd} ${sY}
                L ${x + w * (qrsEnd + 0.025)} ${baseline}
                L ${x + w * (qrsEnd + 0.035)} ${baseline - 3 * profile.postQrsJitter}
                L ${x + w * (qrsEnd + 0.045)} ${baseline + 2 * profile.postQrsJitter}
                L ${x + w * (qrsEnd + 0.055)} ${baseline - 2 * profile.postQrsJitter}
                L ${x + w * (qrsEnd + 0.065)} ${baseline}
    
            `
        }

        if (profile.qrsStyle === "reduced") {
            const reducedRY = baseline - 45 * profile.qrsAmp
            const reducedSY = baseline + 10 * profile.qrsAmp

            fullD += `
                L ${x + w * qrsStart} ${baseline + 3}
                C ${x + w * (qrsStart + 0.015)} ${baseline - 8}, ${x + w * (qrsPeak - 0.01)} ${reducedRY}, ${x + w * qrsPeak} ${reducedRY}
                C ${x + w * (qrsPeak + 0.01)} ${reducedRY}, ${x + w * (qrsEnd - 0.01)} ${reducedSY}, ${x + w * qrsEnd} ${reducedSY}
            `
        }

        if (profile.qrsStyle === "none") {
            fullD += `
                C ${x + w * (qrsStart - 0.08)} ${baseline}, ${x + w * (qrsStart - 0.05)} ${baseline - 8 * profile.stElevation}, ${x + w * (qrsStart - 0.02)} ${baseline - 20 * profile.stElevation}
                C ${x + w * qrsStart} ${baseline - 30 * profile.stElevation},  ${x + w * (qrsStart + 0.02)} ${elevatedY}, ${x + w * (qrsStart + 0.03)} ${elevatedY}
            `

        }   

        // ST segment + post-QRS oscillation
        fullD += `
            C ${x + w * (stStart + 0.015)} ${baseline - 8 * profile.stElevation},  ${x + w * (stStart + 0.035)} ${stY - postQrsWobble}, ${x + w * (stStart + 0.055)} ${stY}
            C ${x + w * (stStart + 0.075)} ${stY + postQrsWobble}, ${x + w * (stStart + 0.095)} ${stY - postQrsWobble * 0.6}, ${x + w * (stStart + 0.115)} ${stY}
            C ${x + w * (stStart + 0.135)} ${stY + postQrsWobble * 0.7}, ${x + w * (stStart + 0.155)} ${stY - postQrsWobble * 0.5}, ${x + w * stEnd} ${stY}
            C ${x + w * (stEnd + 0.03)} ${baseline + 3}, ${x + w * (tPeak - 0.035)} ${tY}, ${x + w * tPeak} ${tY}
            C ${x + w * (tPeak + 0.04)} ${tY}, ${x + w * (tEnd - 0.045)} ${baseline}, ${x + w * tEnd} ${baseline}
            L ${x + w} ${baseline}
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

function ICUContainer({ phase, type, d, overlayD, severity }: { phase: number; type: 'ecg' | 'pressure'; d: string; overlayD?: string, overlay?: string, severity?: 'minor' | 'major' }) {
    const safePhase = isNaN(phase) ? 0 : phase
    const xPos = safePhase * 100

    return (
        <div className={`${type} container`}>
            <div className="container-content-wrapper">
                <div className="waveform-main-area">
                    {type === 'pressure' && (
                        <div className="pressure-scale">
                            <span>120</span>
                            <span>0</span>
                        </div>
                    )}
                    <div style={{ position: 'relative', width: '100%', height: '100%', flex: 1, overflow: 'hidden' }}>
                        <svg className="monitor-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} 150`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                            <path d={d} className={`${type}-waveform`} />
                            {overlayD && <path d={overlayD} className={`${type}-waveform condition-waveform ${severity === 'minor' ? 'minor' : 'major'}`} />}
                </svg>

                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: `${xPos}%`,
                                width: '0.15%',
                                background: '#b8362a',
                                opacity: 0.98,
                                pointerEvents: 'none',
                                transition: 'none',
                                borderRadius: '20px',
                            }}
                        />
                    </div>
                </div>
                <div className="graph-description">
                    {type === "ecg" ? "Electrocardiogram (ECG)" : "Pressure (mmHg)"}
                </div>
            </div>
        </div>
    )
}

function HeartRateContainer({ bpm }: { bpm: number }) {
    const { setBpm } = useHeartMonitor()
    return (
        <div className="heartrate container">
            <span className="heart-rate-label">HEART RATE</span>
            <strong className="heart-rate-value">{bpm}</strong>
            <span className="heart-rate-label">BPM</span>
            <input
                className="bpm-slider"
                type="range"
                min="0"
                max="180"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
            />
        </div>
    )
}