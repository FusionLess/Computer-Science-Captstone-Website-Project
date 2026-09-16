export type HeartCategory = "healthy" | "attack" | "electricity" | "failure";

export type HeartOption =
    | "Healthy"
    | "Minor"
    | "Severe"
    | "Fibrillation"
    | "Compensated"
    | "Decompensated";

export type HeartState = {
    category: HeartCategory;
    option: HeartOption;
};