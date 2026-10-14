import type {HeartCategory, HeartOption, HeartState} from "../../../components/types/states.ts";
import "./ConditionSelector.css"
import type { Complexity } from "../../../components/types/complexities.ts"
import { getHeartPath, getComparePath } from "../../../utils/heartRoutes"
import { useNavigate } from "react-router"

// Lucide icons: https://lucide.dev (license in public/licenses/lucide.txt).
const heartOutline = "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
const iconPaths: Record<HeartCategory, string[]> = {
    healthy: [heartOutline],
    attack: [
        "M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15",
        "M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z",
    ],
    electricity: ["M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"],
    failure: [
        "M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655",
        "m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761",
        "m2 2 20 20",
    ],
}

// Tabler heart-exclamation: https://tabler.io/icons/icon/heart-exclamation
// License in public/licenses/tabler.txt.
const heartExclamation = [
    "M15.03 17l-3.03 3l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.922 6.102",
    "M19 16v3",
    "M19 22v.01",
]

const optionIconPaths: Record<HeartOption, string[]> = {
    Healthy: [heartOutline],
    Minor: heartExclamation,
    Severe: heartExclamation,
    Fibrillation: [heartOutline, "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"],
    Compensated: [
        "m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49",
        "M15 15h6",
        "M18 12v6",
    ],
    Decompensated: [
        "m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572",
        "M15 15h6",
    ],
}

export default function ConditionSelector({active, setActive, complexity, updateRoute, otherHeart, compareSide, onNavigate} :
                      { active: HeartState, setActive: (v: HeartState) => void; complexity: Complexity, updateRoute: boolean, otherHeart?: HeartState, compareSide?: "first" | "second", onNavigate?: (to: string) => void}) {
    const routerNavigate = useNavigate()
    const navigate = onNavigate ?? routerNavigate
    const toggles: { id: HeartCategory; label: string }[] = [
        {id:"healthy", label:"The Heart"},
        {id:"attack", label:"Attack"},
        {id:"electricity", label:"Electricity"},
        {id:"failure", label:"Failure"}
    ]

    const defaultOptions: Record<HeartCategory, HeartOption> = {
        healthy: "Healthy",
        attack: "Minor",
        electricity: "Fibrillation",
        failure: "Compensated"
    };

    const options: Record<HeartCategory, HeartOption[]> = {
        healthy: ["Healthy"],
        attack: ["Minor", "Severe"],
        electricity: ["Fibrillation"],
        failure: ["Compensated", "Decompensated"]
    };

    // Colors for each option
    const optionTone: Record<HeartOption, string> = {
        Healthy: "green",
        Minor: "amber",
        Severe: "red",
        Fibrillation: "blue",
        Compensated: "amber",
        Decompensated: "red",
    };
    const handleHeartSelection = (next: HeartState) => {
        setActive(next)

        if (compareSide && otherHeart) {
            const first = compareSide === "first" ? next : otherHeart
            const second = compareSide === "second" ? next : otherHeart

            navigate(getComparePath(complexity, first, second))
        } else if (updateRoute) {
            navigate(getHeartPath(
                complexity,
                next.category,
                next.option
            ))
        }
    }

    return (
        <div className="heart_buttons">
            <div className="toggle_buttons">
                {toggles.map(opt => (
                    <button key={opt.id}
                            type="button"
                            className={`${opt.id} ${active.category === opt.id ? "active" : "inactive"}`}
                            onClick={() => {
                                handleHeartSelection({
                                    category: opt.id,
                                    option: defaultOptions[opt.id]
                                })
                            }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            focusable="false"
                        >
                            {iconPaths[opt.id].map(path => <path key={path} d={path} />)}
                        </svg>
                        <span className="heart_button_label">{opt.label}</span>
                    </button>
                ))}
            </div>
            <div className="options_buttons">
                    {options[active.category].map(option => (
                        <button
                            key={option}
                            className={`${optionTone[option]} ${
                                active.option === option ? "selected" : ""
                            }`}
                            onClick={() => {
                                handleHeartSelection({
                                    category: active.category,
                                    option
                                })
                            }}
                        >
                            <svg
                                className="heart_option_icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                focusable="false"
                            >
                                {optionIconPaths[option].map(path => <path key={path} d={path} />)}
                            </svg>
                            <span className="heart_option_label">{option}</span>
                        </button>
                    ))}
            </div>
        </div>
    )
}
