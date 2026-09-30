import type {HeartState} from "./states.ts";

export type CompareState = {
    selection1: HeartState
    selection2: HeartState
    chooseSelection1: (value: HeartState) => void
    chooseSelection2: (value: HeartState) => void
    isComparing: boolean
    setIsComparing: (value: boolean) => void
}