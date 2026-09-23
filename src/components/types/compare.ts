import type {HeartOption} from "./states.ts";

export type CompareState = {
    selection1: HeartOption | null;
    selection2: HeartOption | null;
    chooseSelection1: (v: HeartOption | null) => void;
    chooseSelection2: (v: HeartOption | null) => void;
    isComparing: boolean;
    setIsComparing: (v: boolean) => void;
};
