import { HeartParts } from "../../../data/HeartParts.ts"
import "./HeartPartInfo.css"
import type { Complexity } from "../../types/complexities.ts"
import { useState } from "react"
import PopUpInfoBox from "./PopUpInfoBox.tsx"
function HeartPartInfo({
    selectedPart, complexity
}: {
    selectedPart: string | null
    complexity: Complexity
}) {
    const info = selectedPart
        ? HeartParts[
              selectedPart as keyof typeof HeartParts
          ]
        : null
    const [showPopup, setShowPopup] = useState(false)

    return (
        <section className="heart_part_info">
            <h3>Heart Anatomy</h3>
            {info ? (
                <div className="heart_part_description">
                    <h4>{info.name}</h4>
                    <p>{info.description[complexity]}</p>
                </div>
            ) : (
                <p>
                    Click a part of the heart to learn more.
                </p>
            )}
                <button className="explore_button" onClick={() => setShowPopup(true)}>
                    <span className="explore_button_label">
                        {info ? "Explore this part" : "Browse heart anatomy"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                    </span>
            </button>
            {showPopup && (
                <PopUpInfoBox
                    variant="anatomy"
                    selectedPart={selectedPart}
                    complexity={complexity}
                    onClose={() => setShowPopup(false)}
                />
            )}
            
        </section>
        
    )
}

export default HeartPartInfo