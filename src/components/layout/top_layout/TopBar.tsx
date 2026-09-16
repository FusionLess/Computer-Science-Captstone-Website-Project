import "./TopBar.css"
import SidePanel from "./SidePanel.tsx"
import { useState } from "react"
import type { CompareState } from "../../types/compare.ts"

function TopBar({graphActive, setGraphActive, compareState}:{graphActive:boolean, setGraphActive:(v : boolean)=>void, compareState: CompareState}) {
    return (
        <header className="topbar">
            <SettingsButton setGraphActive={setGraphActive} graphActive={graphActive} compareState={compareState}/>
            <div className="logo">
                <img src='images/ABI_logo_blue.png' alt="ABI logo"/>
            </div>
            <div className="right_buttons">
                <HomeButton />
                <AboutButton />
            </div>
        </header>

    )
}

function SettingsButton({setGraphActive, graphActive, compareState}:{graphActive:boolean, setGraphActive:(v : boolean)=>void, compareState: CompareState}) {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className = "settings_button">
            <button
                onClick={() => setOpen(!isOpen)}
                className={(isOpen ? "active" : "inactive")}
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
            </button>
            {isOpen && <div className="backdrop" onClick={() => setOpen(false)} />}
            <SidePanel isOpen={isOpen} setGraphActive={setGraphActive} graphActive={graphActive} compareState={compareState}/>
        </div>
    )
}

function HomeButton() {
    return (
        <div className="home_button">
            <button aria-label="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-house">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                    <path
                        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <text>Home</text>
            </button>
        </div>
    )
}

function AboutButton() {
    return (
        <div className="about_button">
            <button aria-label="About Us">
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
            </button>
        </div>
    )
}

export default TopBar;