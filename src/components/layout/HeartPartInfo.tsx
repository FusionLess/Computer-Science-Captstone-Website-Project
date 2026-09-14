import { HeartParts } from "../../data/HeartParts"
import "./HeartPartInfo.css"

function HeartPartInfo({
    selectedPart,
}: {
    selectedPart: string | null
}) {
    const info = selectedPart
        ? HeartParts[
              selectedPart as keyof typeof HeartParts
          ]
        : null

    return (
        <section className="heart_part_info">
            <h3>Heart Part Info</h3>

            {info ? (
                <div className="heart_part_description">
                    <h4>{info.name}</h4>

                    <p>{info.description}</p>

                    <strong>Function</strong>

                    <p>{info.function}</p>
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