import "./AboutContent.css"
import {AboutInfo} from "../../../data/AboutInfo.ts";

export default function TeamContent() {
    const info = AboutInfo["team"]

    return (
        <>
            <h1 className="team content-heading">
                {info.heading}
            </h1>
            <p className="team content-desc-prim">
                {info.body1}
            </p>
            <div className="team-grid">
                {info.images.map((person) => (
                    <figure className="team-member" key={person.image}>
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