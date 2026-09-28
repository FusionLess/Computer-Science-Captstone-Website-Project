import type {HeartCategory, HeartOption, HeartState} from "../../types/states.ts";
import "./HeartButtons.css"

// Lucide icons: https://lucide.dev (license in public/licenses/lucide.txt).
const heartOutline = "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
const iconPaths: Record<HeartCategory, string[]> = {
    healthy: [heartOutline],
    attack: [heartOutline, "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"],
    electricity: ["M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"],
    failure: [
        "m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572",
        "M15 15h6",
    ],
}

export default function HeartButtons({active, setActive} :
                      { active: HeartState, setActive: (v: HeartState) => void }) {
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


    return (
        <div className="heart_buttons">
            <div className="toggle_buttons">
                {toggles.map(opt => (
                    <button key={opt.id}
                            type="button"
                            className={`${opt.id} ${active.category === opt.id ? "active" : "inactive"}`}
                            onClick={() => {
                                setActive({
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
                                setActive({
                                    category: active.category,
                                    option
                                })
                            }}
                        >
                            {option}
                        </button>
                    ))}
            </div>
        </div>
    )
}
