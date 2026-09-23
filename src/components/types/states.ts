export type HeartCategory = "healthy" | "attack" | "electricity" | "failure";

export type HeartOption =
    | "Normal"
    | "Minor"
    | "Severe"
    | "Fibrillation"
    | "Compensated"
    | "Decompensated";

export type HeartState = {
    category: HeartCategory;
    option: HeartOption;
};
export const HEART_STATE_TITLES: Record<HeartOption, string> = {
    Normal: "Healthy Heart",
    Minor: "Minor Heart Attack",
    Severe: "Severe Heart Attack",
    Fibrillation: "Fibrillation",
    Compensated: "Compensated Heart Failure",
    Decompensated: "Decompensated Heart Failure"
}