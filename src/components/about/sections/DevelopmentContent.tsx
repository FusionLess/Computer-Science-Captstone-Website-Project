import "./AboutContent.css"
import {AboutInfo} from "../../../data/AboutInfo.ts";

export default function DevelopmentContent() {
    const info = AboutInfo["development"]
    return (
        <>
            <h1 className="development content-heading">
                {info.heading}
            </h1>
            <p className="development content-desc-prim">
                {info.body1}
            </p>
            <div className="team-grid">
                {info.images.map((person) => (
                    <figure className="team-member" key={person.name}>
                        <img
                            src={person.image}
                            alt={person.name}
                            loading="lazy"
                        />
                        <figcaption>{person.name}</figcaption>
                    </figure>
                ))}
            </div>
        </>
    )
}