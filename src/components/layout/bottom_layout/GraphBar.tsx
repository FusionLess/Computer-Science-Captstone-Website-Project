import "./GraphBar.css"
import { GRAPH_BEAT_COUNT, useHeartMonitor } from "../../context/HeartMonitorContext.tsx"
import { ecgProfiles, type ECGProfile } from "../../../data/ECGParameters.ts"
import type { HeartState } from "../../types/states.ts"
import { pressureProfiles, type PressureProfile } from "../../../data/PressureParameters.ts"
import { useState } from "react"
const BEAT_COUNT = GRAPH_BEAT_COUNT
const VIEWBOX_WIDTH = 500


type GraphBarProps = {
    active: HeartState,
    graphActive: boolean,
}

export default function GraphBar({ active, graphActive }: GraphBarProps) {
    const [showVolume, setShowVolume] = useState(true)
    const [showPressure, setShowPressure] = useState(true)
    const [showHealthyPressure, setShowHealthyPressure] = useState(true)
    const { bpm, graphPhase } = useHeartMonitor()
    const getECGProfile = () => {
        switch (active.option) {
            case "Healthy":
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
    const getPressureProfile = () => {
        switch (active.option) {
            case "Healthy":
                return pressureProfiles.healthy
            case "Minor":
                return pressureProfiles.minorAttack

            case "Severe":
                return pressureProfiles.severeAttack

            case "Fibrillation":
                return pressureProfiles.fibrillation

            case "Compensated":
                return pressureProfiles.compensated

            case "Decompensated":
                return pressureProfiles.decompensated

            default:
                return pressureProfiles.healthy 
        }
    }

    const profile1 = getECGProfile()
    const profile2 = getPressureProfile()
    const [visibleGraph, setVisibleGraph] = useState<"ecg" | "pressure">("ecg")

    if (!graphActive) return null
    return (
        <footer className={`graphs mobile_${visibleGraph}`}>
            <ICUContainer
                phase={graphPhase}
                type="ecg"
                d={generateECGPath(ecgProfiles.healthy)}
                overlayD={profile1.severity !== "healthy"  ? generateECGPath(profile1) : undefined}
                severity={profile1.severity !== "healthy" ? profile1.severity : undefined}
            />
            <HeartRateContainer bpm={bpm} />
            <button
                className="mobile_graph_switch"
                onClick={() =>
                    setVisibleGraph(
                        visibleGraph === "ecg" ? "pressure" : "ecg"
                    )
                }
                aria-label={
                    visibleGraph === "ecg"
                        ? "Show pressure and volume graph"
                        : "Show ECG graph"
                }
            >
                {visibleGraph === "ecg" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-chevron-left preview-icon">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-chevron-right preview-icon">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                )}
            </button>
            <ICUContainer
                phase={graphPhase}
                type="pressure"
                d={generatePressurePath(pressureProfiles.healthy)}
                overlayD={profile2.severity !== "healthy"  ? generatePressurePath(profile2) : undefined}
                severity={profile2.severity !== "healthy" ? profile2.severity : undefined}
                volumeD={active.option === "Fibrillation"
                    ? generateFibrillationPath(
                        profile2.pAmp,
                        profile2.pWidth,
                        true,
                        20, 10
                    )
                    : generatePressurePath(profile2)}
                isFibrillation={active.option === "Fibrillation"}

                showVolume={showVolume}
                showPressure={showPressure}
                showHealthyPressure={showHealthyPressure}

                onTogglePressure={() => setShowPressure(prev => !prev)}
                onToggleVolume={() => setShowVolume(prev => !prev)}
                onToggleHealthyPressure={() => setShowHealthyPressure(prev => !prev)}
            />
        </footer>
    )}
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

function generateFibrillationPath(ampScale = 1, widthScale = 1, variation = false, baselineAlt= 0, variationScaleAmt = 5) {
    let fullD = "M 0 100"

    const baseline = 117 + baselineAlt
    const oscillations = BEAT_COUNT * 8 / widthScale
    const high = baseline - 40 * ampScale 
    const low = baseline + 35 * ampScale
   
    for (let i = 0; i < oscillations; i++) {
        const x = i * (VIEWBOX_WIDTH / oscillations)
        const w = VIEWBOX_WIDTH / oscillations
        

        if (variation === true) {
            const variationScale = Math.sin(i * 2) * variationScaleAmt 

            const newHigh = high + variationScale
            const newLow = low  - variationScale

            fullD += `
                C ${x + w * 0.15} ${baseline}, ${x + w * 0.20} ${newHigh}, ${x + w * 0.35} ${newHigh}
                C ${x + w * 0.50} ${newHigh}, ${x + w * 0.55} ${newLow},${x + w * 0.70} ${newLow}
                C ${x + w * 0.85} ${newLow},${x + w * 0.90} ${baseline}, ${x + w} ${baseline}
            `
        } else {
            fullD += `
                C ${x + w * 0.15} ${baseline}, ${x + w * 0.20} ${high}, ${x + w * 0.35} ${high}
                C ${x + w * 0.50} ${high}, ${x + w * 0.55} ${low},${x + w * 0.70} ${low}
                C ${x + w * 0.85} ${low},${x + w * 0.90} ${baseline}, ${x + w} ${baseline}
            `
        }
    }

    return fullD
}

function generateECGPath(profile1: ECGProfile) {
     if (profile1.waveform === "fibrillation") {
        return generateFibrillationPath(profile1.pAmp, profile1.qrsWidth, true)
    }
    let fullD = "M 0 117 "
    for (let i = 0; i < BEAT_COUNT; i++) {
        const x = i * (VIEWBOX_WIDTH / BEAT_COUNT)
        const w = VIEWBOX_WIDTH / BEAT_COUNT

        const postQrsWobble = 8 * profile1.rhythmJitter

        const baseline = 117

        // Wave amplitudes
        const pY = baseline - 10 * profile1.pAmp
        const rY = baseline - 104 * profile1.qrsAmp 
        const sY = baseline + 21 * profile1.sAmp

        const stY = baseline - 24 * profile1.stElevation
        const elevatedY = baseline - 35 * profile1.stElevation

        // T wave
        const tDirection = profile1.tInverted ? 1 : -1
        const tY = baseline + tDirection * 16 * profile1.tAmp 

        // QRS timing
        const qrsStart = 0.30 + profile1.qrsOffset
        const qrsPeak = qrsStart + 0.03 * profile1.qrsWidth
        const qrsEnd = qrsStart + 0.06 * profile1.qrsWidth

        // ST timing changes depending on whether QRS is shown
        const stStart = profile1.qrsStyle === "none" ? 0.33 : qrsEnd + 0.07
        const stEnd = stStart + 0.16 * profile1.stDuration

        // T wave timing
        const tPeak = stEnd + 0.09 * profile1.tStartOffset
        const tEnd = stEnd + 0.20 * profile1.tWidth

        // P wave
        fullD += `
            L ${x + w * 0.06} ${baseline}
            C ${x + w * 0.08} ${baseline - 1},  ${x + w * 0.12} ${pY}, ${x + w * 0.17} ${pY}
            C ${x + w * 0.18} ${pY},  ${x + w * 0.20} ${baseline},  ${x + w * 0.22} ${baseline + 1}
        `

        // QRS complex
        if (profile1.qrsStyle === "normal") {
            fullD += `
                L ${x + w * qrsStart} ${baseline + 8}
                L ${x + w * qrsPeak} ${rY}
                L ${x + w * qrsEnd} ${sY}
                L ${x + w * (qrsEnd + 0.025)} ${baseline}
                L ${x + w * (qrsEnd + 0.035)} ${baseline - 3 * profile1.postQrsJitter}
                L ${x + w * (qrsEnd + 0.045)} ${baseline + 2 * profile1.postQrsJitter}
                L ${x + w * (qrsEnd + 0.055)} ${baseline - 2 * profile1.postQrsJitter}
                L ${x + w * (qrsEnd + 0.065)} ${baseline}
    
            `
        }

        if (profile1.qrsStyle === "reduced") {
            const reducedRY = baseline - 45 * profile1.qrsAmp
            const reducedSY = baseline + 10 * profile1.qrsAmp

            fullD += `
                L ${x + w * qrsStart} ${baseline + 3}
                C ${x + w * (qrsStart + 0.015)} ${baseline - 8}, ${x + w * (qrsPeak - 0.01)} ${reducedRY}, ${x + w * qrsPeak} ${reducedRY}
                C ${x + w * (qrsPeak + 0.01)} ${reducedRY}, ${x + w * (qrsEnd - 0.01)} ${reducedSY}, ${x + w * qrsEnd} ${reducedSY}
            `
        }

        if (profile1.qrsStyle === "none") {
            fullD += `
                C ${x + w * 0.25} ${baseline},
                ${x + w * 0.3} ${baseline - 5 * profile1.stElevation},
                ${x + w * 0.34} ${baseline}

                C ${x + w * (0.33 + profile1.qrsOffset)} ${baseline}, ${x + w * (0.35 + profile1.qrsOffset)} ${baseline - 30 * profile1.stElevation}, ${x + w * (0.37 + profile1.qrsOffset)} ${elevatedY}

                C ${x + w * (0.385 + profile1.qrsOffset)} ${elevatedY + 7} ${x + w * (0.395 + profile1.qrsOffset)} ${elevatedY + 10},  ${x + w * (0.405 + profile1.qrsOffset)} ${elevatedY + 6}

                C ${x + w * (0.415 + profile1.qrsOffset)} ${elevatedY + 3},  ${x + w * (0.425 + profile1.qrsOffset)} ${elevatedY + 9}, ${x + w * (0.435 + profile1.qrsOffset)} ${elevatedY + 6}

                C ${x + w * (0.45 + profile1.qrsOffset)} ${elevatedY + 8}, ${x + w * (0.46 + profile1.qrsOffset)} ${stY}, ${x + w * (0.48 + profile1.qrsOffset)} ${baseline + 16}

                C ${x + w * (0.51 + profile1.qrsOffset)} ${baseline + 22}, ${x + w * (0.51 + 0.06 * profile1.tWidth + profile1.qrsOffset)} ${baseline + 24}, ${x + w * (0.51 + 0.12 * profile1.tWidth + profile1.qrsOffset)} ${tY}

                C ${x + w * (0.51 + 0.16 * profile1.tWidth + profile1.qrsOffset)} ${tY}, ${x + w * (0.51 + 0.19 * profile1.tWidth + profile1.qrsOffset)} ${tY}, ${x + w * (0.51 + 0.22 * profile1.tWidth + profile1.qrsOffset)} ${baseline + 6}

                C ${x + w * (0.51 + 0.24 * profile1.tWidth + profile1.qrsOffset)} ${baseline}, ${x + w * (0.51 + 0.27 * profile1.tWidth + profile1.qrsOffset)} ${baseline}, ${x + w * (0.51 + 0.31 * profile1.tWidth + profile1.qrsOffset)} ${baseline}

                C ${x + w * (0.75 + profile1.qrsOffset)} ${baseline}, ${x + w * (0.78 + profile1.qrsOffset)} ${baseline},  ${x + w * (0.82 + profile1.qrsOffset)} ${baseline}

                L ${x + w} ${baseline}
            `
        }
        
        if (profile1.qrsStyle !== "none") {
            fullD += `
                C ${x + w * (stStart + 0.015)} ${baseline - 8 * profile1.stElevation}, ${x + w * (stStart + 0.035)} ${stY - postQrsWobble},  ${x + w * (stStart + 0.055)} ${stY}
                C ${x + w * (stStart + 0.075)} ${stY + postQrsWobble},  ${x + w * (stStart + 0.095)} ${stY - postQrsWobble * 0.6}, ${x + w * (stStart + 0.115)} ${stY}
                C ${x + w * (stStart + 0.135)} ${stY + postQrsWobble * 0.7}, ${x + w * (stStart + 0.155)} ${stY - postQrsWobble * 0.5}, ${x + w * stEnd} ${stY}
                C ${x + w * (stEnd + 0.03)} ${baseline + 3}, ${x + w * (tPeak - 0.035)} ${tY},  ${x + w * tPeak} ${tY}
                C ${x + w * (tPeak + 0.04)} ${tY},  ${x + w * (tEnd - 0.045)} ${baseline},  ${x + w * tEnd} ${baseline}
                L ${x + w} ${baseline}
            `
        }

        
    }
    return fullD
}

function generatePressurePath(profile2: PressureProfile) {
    if (profile2.waveform === "fibrillation") {
        return generateFibrillationPath(profile2.pAmp, profile2.pWidth, true)
    }
    let fullD = "M 0 115 "
    const baseline = 115
    for (let i = 0; i < BEAT_COUNT; i++) {
        const x = i * (VIEWBOX_WIDTH / BEAT_COUNT)
        const w = VIEWBOX_WIDTH / BEAT_COUNT

        const peakY = baseline - (baseline - 22) * profile2.pAmp
        const troughY = 118 + (profile2.tAmp - 1) * 5
        const fallEnd = 0.72 + 0.14 / profile2.fallSpeed + profile2.pOffset
        const recoveryEnd = fallEnd + 0.14 / profile2.recoverySpeed
        const startY = baseline - profile2.startOffset
        const endY = baseline - profile2.endOffset
        const width = (1 - profile2.pWidth) * 0.15
        if (profile2.waveform === "reduced") {
            fullD += `
                L ${x + w * (0.10 + width)} ${startY}
                C ${x + w * (0.20 + width + 0.03 / profile2.riseSpeed)} ${startY}, ${x + w * (0.28 + width + 0.04 / profile2.riseSpeed)} ${startY}, ${x + w * (0.34 + width + 0.07 / profile2.riseSpeed)} ${baseline - 22}
                C ${x + w * (0.39 + width)} ${baseline - 27}, ${x + w * (0.50 + width)} ${baseline - 39}, ${x + w * 0.56} ${peakY + 11}
                C ${x + w * (0.72 - width)} ${peakY - 2}, ${x + w * (0.80 - width)} ${peakY + 15}, ${x + w * (0.88 - width)} ${baseline - 25}
                C ${x + w * (0.93 - width)} ${baseline - 15}, ${x + w * (0.97 - width)} ${endY}, ${x + w * (1 - width)} ${endY}      
    
            `
        } else {
            fullD += `
            C ${x + w * 0.10} 113, ${x + w * 0.20} 116, ${x + w * (0.32 + profile2.pOffset)} 111
            C ${x + w * (0.38 + profile2.pOffset)} 107, ${x + w * (0.40 + profile2.pOffset)} 75, ${x + w * (0.46 + profile2.pOffset)} 66
            C ${x + w * (0.50 + profile2.pOffset)} 53, ${x + w * (0.54 + profile2.pOffset)} 35,  ${x + w * (0.66 + profile2.pOffset)} ${peakY}
            C ${x + w * (0.66 + 0.02 * profile2.pWidth + profile2.pOffset)} 23, ${x + w * (0.66 + 0.04 * profile2.pWidth + profile2.pOffset)} 25, ${x + w * (0.66 + 0.06 * profile2.pWidth + profile2.pOffset)} 46
            C ${x + w * (0.72 + 0.04 / profile2.fallSpeed + profile2.pOffset)} 71, ${x + w * (0.72 + 0.08 / profile2.fallSpeed + profile2.pOffset)} 99, ${x + w * fallEnd} ${troughY}
            C ${x + w * (fallEnd + 0.04 / profile2.recoverySpeed)} ${troughY},  ${x + w * (fallEnd + 0.09 / profile2.recoverySpeed)} ${baseline}, ${x + w * recoveryEnd} ${baseline}
            L ${x + w} ${baseline}
        `
        }
    }

    return fullD
}

function ICUContainer({ phase, type, d, overlayD, severity, volumeD, showVolume, onToggleVolume, showPressure, onTogglePressure, showHealthyPressure, onToggleHealthyPressure, isFibrillation }: { phase: number; type: 'ecg' | 'pressure'; d: string; overlayD?: string, overlay?: string, severity?: 'minor' | 'major', volumeD?: string, showVolume?: boolean, onToggleVolume?: () => void, showPressure?: boolean, onTogglePressure?: () => void, showHealthyPressure?: boolean, onToggleHealthyPressure?: () => void, isFibrillation?: boolean }) {
    const safePhase = isNaN(phase) ? 0 : phase
    const xPos = safePhase * 100

    return (
        <div className={`${type} container`}>
            <div className="container-content-wrapper">
                <div className="waveform-main-area">
                    {type === 'pressure' && (
                        <>
                            {(showPressure || (overlayD? showHealthyPressure: showPressure))&& (
                                <div className="pressure-scale">
                                    <span>120</span>
                                    <span className="scale-unit">mmHg</span>
                                    <span>0</span>
                                </div>
                            )}
                            {showVolume && (
                                <div className="volume-scale">
                                    <span>120</span>
                                    <span className="scale-unit">mL</span>
                                    <span>0</span>
                                </div>
                            )}
                        </>
                    )}
                    
                    <div style={{
                        position: 'relative', width: '100%', height: '100%', flex: 1, overflow: 'hidden', marginLeft: type === "pressure" ? "55px" : "0",
                        marginRight: type === "pressure" ? "35px" : "0" }}>
                        <svg className="monitor-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} 150`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                            {/* ECG */}
                            {type === "ecg" && (
                                <>
                                    <path d={d} className="ecg-waveform"/>
                                    {overlayD && ( <path d={overlayD}className={`ecg-waveform condition-waveform ${severity === "minor" ? "minor" : "major"}`}/>)}
                                </>
                            )}

                            {/* Healthy pressure */}
                            {type === "pressure" && (overlayD? showHealthyPressure : showPressure) && (
                                <path d={d}className="pressure-waveform"/>
                            )}
                            {/* Selected condition pressure */}
                            {type === "pressure" && showPressure && overlayD && (
                                <path d={overlayD} className={`pressure-waveform condition-waveform ${severity === "minor" ? "minor" : "major"}`}/>
                            )}
                            {/* Volume */}
                            {type === "pressure" && showVolume && volumeD && (
                                <path d={volumeD} className="volume-waveform" transform={ isFibrillation? undefined : "translate(0 150) scale(1 -1)"}/>
                            )}
                        </svg>
                        <div
                            className="graph-marker"
                            style={{ left: `${xPos}%` }}
                        />
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
                    {type === "ecg" ? (
                        "Electrocardiogram (ECG)"
                    ) : (
                        <>
                            {overlayD && (
                                <button
                                    className={`graph-toggle ${showHealthyPressure ? "active" : ""}`}
                                    onClick={onToggleHealthyPressure}
                                    aria-pressed={showHealthyPressure}
                                >
                                    <span className="legend-line healthy-line" />
                                    Healthy
                                </button>
                            )}
                            <button 
                                className={`graph-toggle ${showPressure ? "active" : ""}`} 
                                onClick={onTogglePressure} 
                                aria-pressed={showPressure}>
                                <span 
                                    className={`legend-line pressure-line ${severity === "minor"
                                    ? "minor"
                                    : severity === "major"
                                        ? "major"
                                        : "healthy"
                                    }`} 
                                />
                                Pressure (mmHg)
                            </button>
                            <button 
                                className={`graph-toggle ${showVolume ? "active" : ""}`} 
                                onClick={onToggleVolume} 
                                aria-pressed={showVolume}>
                                <span 
                                    className="legend-line volume-line"/>
                                    Volume (mL)
                            </button>
                        </>
                    )}
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
            <input
                className="heart-rate-value bpm-input"
                type="number"
                inputMode="numeric"
                min="0"
                max="180"
                value={bpm}
                aria-label="Heart rate in BPM"
                onChange={(e) => {
                    const nextBpm = e.target.valueAsNumber;

                    if (Number.isFinite(nextBpm)) {
                        setBpm(Math.min(180, Math.max(0, nextBpm)));
                    }
                }}
            />
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