export type Complexity = "basic" | "standard" | "advanced"

export const complexities: { id: Complexity; label: string }[] = [
    { id: "basic", label: "Basic" },
    { id: "standard", label: "Standard" },
    { id: "advanced", label: "Advanced" },
]