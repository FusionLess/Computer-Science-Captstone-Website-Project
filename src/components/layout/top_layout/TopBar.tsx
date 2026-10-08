import "./TopBar.css"
import Settings from "./Settings.tsx"
import { useState } from "react"
import { NavLink, useLocation } from "react-router";
import type { Complexity } from "../../types/complexities.ts";

function TopBar({graphActive, setGraphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions}: { graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void }) {
    const { pathname } = useLocation()
    const isHomePage = pathname === "/"

    return (
        <header className="topbar">
            <div className="logo">
                <img src='images/ABI_logo_blue.png' alt="ABI logo"/>
            </div>
            {isHomePage && (
                <div className="complexity-title">
                    <h5>{complexity.charAt(0).toUpperCase() + complexity.slice(1)} View</h5>
                </div>
            )}
            <div className="desktop_navigation">
                <HomeButton />
                <AboutButton />
                {isHomePage && <SettingsButton
                    setGraphActive={setGraphActive}
                    graphActive={graphActive}
                    glowActive={glowActive}
                    setGlowActive={setGlowActive}
                    complexity={complexity}
                    setComplexity={setComplexity}
                    showDescriptions={showDescriptions}
                    setShowDescriptions={setShowDescriptions}
                />}
            </div>
            <div className="mobile_settings">
                {isHomePage && (
                    <SettingsButton
                        setGraphActive={setGraphActive}
                        graphActive={graphActive}
                        glowActive={glowActive}
                        setGlowActive={setGlowActive}
                        complexity={complexity}
                        setComplexity={setComplexity}
                        showDescriptions={showDescriptions}
                        setShowDescriptions={setShowDescriptions}
                    />
                )}
            </div>
            <div className="mobile_navigation">
                <HomeButton />
                <AboutButton />
            </div>
        </header>

    )
}

function SettingsButton({setGraphActive, graphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions}: { graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void}) {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className="settings_button">
            <button
                onClick={() => setOpen(!isOpen)}
                className={`nav_button${isOpen ? " active" : ""}`}
                aria-label={isOpen ? "Close settings" : "Open settings"}
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-settings">
                    <path
                        d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Settings</span>
            </button>
            {isOpen && <div className="backdrop" onClick={() => setOpen(false)} />}
            <Settings isOpen={isOpen} onClose={() => setOpen(false)} setGraphActive={setGraphActive} graphActive={graphActive} glowActive={glowActive} setGlowActive={setGlowActive} complexity={complexity} setComplexity={setComplexity} showDescriptions={showDescriptions} setShowDescriptions={setShowDescriptions}/>
        </div>
    )
}

function HomeButton() {
    return (
        <div className="home_button">
            <NavLink
                to="/"
                end
                className={({ isActive }) => `nav_button${isActive ? " active" : ""}`}
                aria-label="Home"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-house">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                    <path
                        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <text>Home</text>
            </NavLink>
        </div>
    )
}

function AboutButton() {
    return (
        <div className="about_button">
            <NavLink
                to="/about"
                end
                className={({ isActive }) => `nav_button${isActive ? " active" : ""}`}
                aria-label="Home"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-user-round-group">
                    <path d="M17 21a5 5 0 00-10 0"/>
                    <path d="M22 10.5a3.5 3.5 0 00-5.507-2.868"/>
                    <path d="M7.507 7.632A3.5 3.5 0 002 10.5"/>
                    <circle cx="12" cy="13" r="3"/>
                    <circle cx="18.5" cy="4.5" r="2.5"/>
                    <circle cx="5.5" cy="4.5" r="2.5"/>
                </svg>
                <text>About Us</text>
            </NavLink>
        </div>
    )
}

export default TopBar;
