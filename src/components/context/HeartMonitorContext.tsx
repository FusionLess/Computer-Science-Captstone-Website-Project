import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Dispatch, type SetStateAction } from "react"

type HeartMonitorContextType = {
    bpm: number
    setBpm: (value: number | ((prev: number) => number)) => void
    isPaused: boolean
    setIsPaused: Dispatch<SetStateAction<boolean>>
    singlePhase: number
    graphPhase: number
}

const HeartMonitorContext = createContext<HeartMonitorContextType | undefined>(undefined)

export const GRAPH_BEAT_COUNT = window.matchMedia("(max-width: 768px)").matches ? 2: 4

export function HeartMonitorProvider({ children }: { children: ReactNode }) {
    const [bpm, setBpm] = useState<number>(60)
    const [isPaused, setIsPaused] = useState<boolean>(false)
    const [singlePhase, setSinglePhase] = useState<number>(0)
    const [graphPhase, setGraphPhase] = useState<number>(0)
    const completedBeats = useRef(0)

    useEffect(() => {
        let frameId: number
        let previous = performance.now()

        const tick = (now: number) => {
            const delta = Math.min((now - previous) / 1000, 0.05)
            previous = now

            if (!isPaused && bpm > 0) {
                completedBeats.current += delta * bpm / 60
                const beats = completedBeats.current
                setSinglePhase(beats % 1)
                setGraphPhase((beats % GRAPH_BEAT_COUNT) / GRAPH_BEAT_COUNT)
            }

            frameId = requestAnimationFrame(tick)
        }

        frameId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frameId)
    }, [bpm, isPaused])

    return (
        <HeartMonitorContext.Provider value={{ bpm, setBpm, isPaused, setIsPaused, singlePhase, graphPhase }}>
            {children}
        </HeartMonitorContext.Provider>
    )
}

export function useHeartMonitor() {
    const context = useContext(HeartMonitorContext)
    if (!context) {
        throw new Error("useHeartMonitor must be used within a HeartMonitorProvider")
    }
    return context
}
