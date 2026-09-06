export type CompareState = {
    selection1: HeartOption | null;
    selection2: HeartOption | null;
    chooseSelection1: (v: HeartOption) => void;
    chooseSelection2: (v: HeartOption) => void;
    isComparing: boolean;
    setIsComparing: (v: boolean) => void;
};
