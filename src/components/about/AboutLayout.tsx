import "./AboutLayout.css"
import { useState } from "react";
import MissionContent from "./sections/MissionContent"
import ResearchContent from "./sections/ResearchContent"
import TeamContent from "./sections/TeamContent"
import DevelopmentContent from "./sections/DevelopmentContent"

type AboutSection = "mission" | "research" | "team" | "development";

const sections = {
    mission: MissionContent,
    research: ResearchContent,
    team: TeamContent,
    development: DevelopmentContent,
}

export default function AboutLayout () {
    const [active, setActive] = useState<AboutSection>("mission")
    return (
        <main className="about-layout">
            <AboutLeft active={active} setActive={setActive}/>
            <AboutMain active={active}/>
        </main>
    )
}

function AboutLeft ({active, setActive} : {active: AboutSection, setActive: (f) => AboutSection}) {

    const toggles: { id: AboutSection; label: string }[] = [
        {id:"mission", label:"Our Mission"},
        {id:"research", label:"Our Research"},
        {id:"team", label:"The Research Team"},
        {id:"development", label:"The Development Team"}
    ]

    return (
        <aside className="left column">
            {toggles.map((opt, index) => (
                <button id={opt.id}
                        key={opt.id}
                        aria-pressed={active === opt.id}
                        className={`${opt.id} ${active === opt.id ? "active" : ""}`}
                        onClick={() => setActive(opt.id)}>
                    <span className="about-option-index" aria-hidden="true">
                        About us / {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="about-option-title">{opt.label}</span>
                </button>
            ))}
        </aside>
    )
}

function AboutMain ({active}:{active:string}) {
    const Content = sections[active]

    return (
        <aside className="main column">
            <Content />
        </aside>
    )
}
