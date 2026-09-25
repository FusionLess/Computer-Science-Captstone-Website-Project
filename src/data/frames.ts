import type { HeartOption } from "../components/types/states.ts";

export const FRAMES : Record<HeartOption, string> = {
    Healthy : "frames",
    Minor : "heart_attack",
    Severe : "severe_heart_attack",
    Fibrillation : "fibrillation_heart",
    Compensated :  "compensated_heart",
    Decompensated : "decompensated_heart"
}