import type { HeartCategory,HeartOption, HeartState} from "../components/types/states"
import type {Complexity} from "../components/types/complexities"

const categoryPaths: Record<HeartCategory, string> = {
    healthy: "heart",
    attack: "heart-attack",
    electricity: "heart-electricity",
    failure: "heart-failure",
}
const compareOptions: Record<HeartOption, HeartState> = {
    Healthy: { category: "healthy", option: "Healthy" },
    Minor: { category: "attack", option: "Minor" },
    Severe: { category: "attack", option: "Severe" },
    Fibrillation: { category: "electricity", option: "Fibrillation" },
    Compensated: { category: "failure", option: "Compensated" },
    Decompensated: { category: "failure", option: "Decompensated" },
}

export function getHeartPath(
    complexity: Complexity,
    category: HeartCategory,
    option: HeartOption
) {
    return `/${complexity}/${categoryPaths[category]}/${option.toLowerCase()}`
}

export function getHeartStateFromRoute(
    category: string | undefined,
    option: string | undefined
): HeartState | null {

    if (category === "heart" && option === "healthy") {
        return {
            category: "healthy",
            option: "Healthy"
        }
    }

    if (category === "heart-attack" && option === "minor") {
        return {
            category: "attack",
            option: "Minor"
        }
    }

    if (category === "heart-attack" && option === "severe") {
        return {
            category: "attack",
            option: "Severe"
        }
    }

    if (category === "heart-electricity" && option === "fibrillation") {
        return {
            category: "electricity",
            option: "Fibrillation"
        }
    }

    if (category === "heart-failure" && option === "compensated") {
        return {
            category: "failure",
            option: "Compensated"
        }
    }

    if (category === "heart-failure" && option === "decompensated") {
        return {
            category: "failure", option: "Decompensated"
        }
    }

    return null
}


export function getComplexityFromRoute(
    value: string | undefined
): Complexity | null {

    if (value === "basic" || value === "standard" || value === "advanced") {
        return value
    }
    return null
}
export function getComparePath(
    complexity: Complexity,
    first: HeartState,
    second: HeartState
) {
    return `/${complexity}/compare/${first.option.toLowerCase()}/${second.option.toLowerCase()}`
}

export function getCompareHeartFromRoute(
    value: string | undefined
): HeartState | null {
    const option = Object.keys(compareOptions).find(key => key.toLowerCase() === value) as HeartOption | undefined
    return option ? compareOptions[option] : null
}