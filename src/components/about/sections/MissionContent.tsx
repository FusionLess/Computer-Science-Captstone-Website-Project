import "./AboutContent.css"
import { AboutInfo } from "../../../data/AboutInfo.ts"

import { Link } from "react-router"

export default function MissionContent() {
    const Info = AboutInfo["mission"]
    return (
        <section className="mission-content">
            <h1 id="mission-heading" className="mission content-heading">
                {Info.heading}
            </h1>
            <p className="mission content-desc-prim">
                {Info.body1}
            </p>
            <div className="mission content-statement">
                <p>{Info.statement}</p>
            </div>

            <div className="mission-features">
                {Info.features.map((feature, index) => (
                    <article className="mission-feature" key={feature.title}>
                        <span className="mission-feature-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2>{feature.title}</h2>
                        <p>{feature.description}</p>
                    </article>
                ))}
            </div>

            <div className="mission-action">
                <Link className="mission-explore" to="/">
                    Explore the heart →
                </Link>
                <p>Start exploring with Project Atrium.</p>
            </div>
        </section>
    )
}
