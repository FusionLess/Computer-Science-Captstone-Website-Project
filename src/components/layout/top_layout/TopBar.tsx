import "./TopBar.css"
import Settings from "./Settings.tsx"
import { useRef, useState, type MouseEvent } from "react"
import { NavLink, useLocation, useNavigate } from "react-router"
import { useHeartMonitor } from "../../context/HeartMonitorContext"
import type { Complexity } from "../../types/complexities.ts";

function TopBar({graphActive, setGraphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions, showAdvancedSliceControls, setShowAdvancedSliceControls}: { graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void, showAdvancedSliceControls: boolean, setShowAdvancedSliceControls: (v: boolean) => void}) {
    const { pathname } = useLocation()
    const isHomePage = pathname === "/"


    const navigate = useNavigate()
    const { setIsPaused } = useHeartMonitor()
    const isNavigating = useRef(false)

    const handleTopBarNavigation = (event: MouseEvent<HTMLElement>) => {
        const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]")

        if (!link) return

        const destination = link.pathname

        if (destination === pathname || isNavigating.current) return

        event.preventDefault()
        isNavigating.current = true

        setIsPaused(true)

        window.setTimeout(() => {
            navigate(destination)
        }, 50)
    }

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="topbar" onClickCapture={handleTopBarNavigation}>
            <div className="logo">
                <img src='/images/ABI_logo_blue.png' alt="ABI logo"/>
            </div>
            {isHomePage && (
                <div className="complexity-title">
                    <h5>{complexity.charAt(0).toUpperCase() + complexity.slice(1)} View</h5>
                </div>
            )}
            <div className="desktop_navigation">
                <HomeButton />
                <ImagingButton />
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
                    showAdvancedSliceControls={showAdvancedSliceControls}
                    setShowAdvancedSliceControls={setShowAdvancedSliceControls}
                />
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
                        showAdvancedSliceControls={showAdvancedSliceControls}
                        setShowAdvancedSliceControls={setShowAdvancedSliceControls}
                    />
                )}
            </div>
            <div className="mobile_navigation">
                <HomeButton />
                <ImagingButton />
                <AboutButton />
            </div>
        </header>

    )
}

function SettingsButton({setGraphActive, graphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions, showAdvancedSliceControls, setShowAdvancedSliceControls}: { graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void, showAdvancedSliceControls: boolean, setShowAdvancedSliceControls: (v: boolean) => void}) {
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
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-settings">
                    <path
                        d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Settings</span>
            </button>
            {isOpen && <div className="backdrop" onClick={() => setOpen(false)} />}
            <Settings isOpen={isOpen} onClose={() => setOpen(false)} setGraphActive={setGraphActive} graphActive={graphActive} glowActive={glowActive} setGlowActive={setGlowActive} complexity={complexity} setComplexity={setComplexity} showDescriptions={showDescriptions} setShowDescriptions={setShowDescriptions} showAdvancedSliceControls={showAdvancedSliceControls}  setShowAdvancedSliceControls={setShowAdvancedSliceControls}/>
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
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-house">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                    <path
                        d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <span>Home</span>
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
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-user-round-group">
                    <path d="M17 21a5 5 0 00-10 0"/>
                    <path d="M22 10.5a3.5 3.5 0 00-5.507-2.868"/>
                    <path d="M7.507 7.632A3.5 3.5 0 002 10.5"/>
                    <circle cx="12" cy="13" r="3"/>
                    <circle cx="18.5" cy="4.5" r="2.5"/>
                    <circle cx="5.5" cy="4.5" r="2.5"/>
                </svg>
                <span>About Us</span>
            </NavLink>
        </div>
    )
}

export default TopBar;

function ImagingButton() {
    const { pathname } = useLocation()

    const isImagingActive =
        pathname === "/imaging" || pathname.startsWith("/imaging/")
    return (
        <div className="imaging_button">
            <NavLink
                to="/imaging/mri"
                end
                className={`nav_button${isImagingActive ? " active" : ""}`}
            >
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
                    aria-hidden="true"
                    focusable="false"
                >
                    {/* Scan corners */}
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />

                    {/* Smaller heart */}
                    <g transform="translate(6 6) scale(0.5)" strokeWidth="4">
                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                    </g>
                </svg>
                <span>Imaging</span>
            </NavLink>
        </div>
    )
}
