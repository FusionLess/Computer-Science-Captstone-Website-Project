import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react"

type HeartMonitorContextType = {
    bpm: number
    setBpm: (value: number | ((prev: number) => number)) => void
    isPaused: boolean
    setIsPaused: Dispatch<SetStateAction<boolean>>
    singlePhase: number
    graphPhase: number
    beatInterval: (elapsedSeconds: number) => void
}

const HeartMonitorContext = createContext<HeartMonitorContextType | undefined>(undefined)

export const GRAPH_BEAT_COUNT = 4

export function HeartMonitorProvider({ children }: { children: ReactNode }) {
    const [bpm, setBpm] = useState<number>(60)
    const [isPaused, setIsPaused] = useState<boolean>(false)
    const [singlePhase, setSinglePhase] = useState<number>(0)
    const [graphPhase, setGraphPhase] = useState<number>(0)
    const beatInterval = (elapsedSeconds: number) => {
        const cycleDuration = 60 / bpm
        const completedBeats = elapsedSeconds / cycleDuration

        setSinglePhase(completedBeats % 1)

        setGraphPhase((completedBeats % GRAPH_BEAT_COUNT) / GRAPH_BEAT_COUNT)
    }


    return (
        <HeartMonitorContext.Provider value={{ bpm, setBpm, isPaused, setIsPaused, singlePhase, graphPhase, beatInterval }}>
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
