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