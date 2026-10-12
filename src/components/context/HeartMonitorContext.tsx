import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode, type Dispatch, type SetStateAction } from "react"

function createPhaseStore() {
    let phase = 0
    const listeners = new Set<() => void>()
    return {
        getSnapshot: () => phase,
        subscribe: (listener: () => void) => {
            listeners.add(listener)
            return () => { listeners.delete(listener) }
        },
        update: (nextPhase: number) => {
            if (Object.is(phase, nextPhase)) return
            phase = nextPhase
            listeners.forEach(listener => listener())
        },
    }
}

type HeartMonitorContextType = {
    bpm: number
    setBpm: (value: number | ((prev: number) => number)) => void
    isPaused: boolean
    setIsPaused: Dispatch<SetStateAction<boolean>>
    phaseStore: ReturnType<typeof createPhaseStore>
    beatInterval: (elapsedSeconds: number) => void
}

const HeartMonitorContext = createContext<HeartMonitorContextType | undefined>(undefined)

export const GRAPH_BEAT_COUNT = window.matchMedia("(max-width: 768px)").matches ? 2: 4

export function HeartMonitorProvider({ children }: { children: ReactNode }) {
    const [bpm, setBpm] = useState<number>(60)
    const [isPaused, setIsPaused] = useState<boolean>(false)
    // Only the animated graphs subscribe to ticks; controls stay in React state.
    const [phaseStore] = useState(createPhaseStore)
    const beatInterval = useCallback((elapsedSeconds: number) => {
        const cycleDuration = 60 / bpm
        const completedBeats = elapsedSeconds / cycleDuration

        phaseStore.update((completedBeats % GRAPH_BEAT_COUNT) / GRAPH_BEAT_COUNT)
    }, [bpm, phaseStore])

    const value = useMemo(() => ({ bpm, setBpm, isPaused, setIsPaused, phaseStore, beatInterval }),
        [bpm, isPaused, phaseStore, beatInterval])


    return (
        <HeartMonitorContext.Provider value={value}>
            {children}
        </HeartMonitorContext.Provider>
    )
}

export function useGraphPhase() {
    const { phaseStore } = useHeartMonitor()
    return useSyncExternalStore(phaseStore.subscribe, phaseStore.getSnapshot)
}

export function useHeartMonitor() {
    const context = useContext(HeartMonitorContext)
    if (!context) {
        throw new Error("useHeartMonitor must be used within a HeartMonitorProvider")
    }
    return context
}
