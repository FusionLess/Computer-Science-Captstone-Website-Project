import { HeartParts } from "../../data/HeartParts"
import "./HeartPartInfo.css"
import type { Complexity } from "../types/complexities"
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

    return (
        <section className="heart_part_info">
            <h3>Heart Anatomy</h3>

            {info ? (
                <div className="heart_part_description">
                    <h4>{info.name}</h4>

                    <p>{info.description[complexity]}</p>

                    <h4>Function</h4>

                    <p>{info.function[complexity]}</p>
                </div>
            ) : (
                <p>
                    Click a part of the heart to learn more.
                </p>
            )}
        </section>
    )
}

export default HeartPartInfo