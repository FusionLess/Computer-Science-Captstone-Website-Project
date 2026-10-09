import "./AboutLayout.css"
import { useState } from "react";
import MissionContent from "./sections/MissionContent.tsx"
import ResearchContent from "./sections/ResearchContent.tsx"
import TeamContent from "./sections/TeamContent.tsx"
import DevelopmentContent from "./sections/DevelopmentContent.tsx"

import type AboutSection from "../../components/types/aboutsections.ts"



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

function AboutLeft ({active, setActive} : {active: AboutSection, setActive: (f: AboutSection) => void}) {

    const toggles: { id: AboutSection; label: string }[] = [
        {id:"mission", label:"Our Mission"},
        {id:"research", label:"Our Research"},
        {id:"team", label:"The Research Team"},
        {id:"development", label:"The Development Team"}
    ]

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const selected = toggles.find((option) => option.id === active)!

    return (
        <>
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

            <aside className="about-mobile-menu">
                <button
                    type="button"
                    className="about-mobile-trigger"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                >
                    <span>{selected.label}</span>
                    <span className={isMenuOpen ? "about-mobile-arrow open" : "about-mobile-arrow"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg>
                    </span>
                </button>

                <div
                    className={`about-mobile-options ${isMenuOpen ? "is-open" : ""}`}
                    aria-hidden={!isMenuOpen}
                >
                    {toggles.map((option, index) => (
                        <button
                            type="button"
                            key={option.id}
                            className={active === option.id ? "active" : ""}
                            onClick={() => {
                                setActive(option.id)
                                setIsMenuOpen(false)
                            }}
                        >
                            <span>About us / {String(index + 1).padStart(2, "0")}</span>
                            <strong>{option.label}</strong>
                        </button>
                    ))}
                </div>
            </aside>
        </>
    )
}

function AboutMain ({active}:{active:AboutSection}) {
    const Content = sections[active]

    return (
        <aside className="main column">
            <Content />
        </aside>
    )
}
