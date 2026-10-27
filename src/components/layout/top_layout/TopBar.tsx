import "./TopBar.css"
import Settings from "./Settings.tsx"
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react"
import { NavLink, useLocation, useNavigate } from "react-router"
import { useHeartMonitor } from "../../context/HeartMonitorContext"
import type { Complexity } from "../../types/complexities.ts";
import { getHeartPath, isHeartPagePath } from "../../../utils/heartRoutes"

function TopBar({showVeins, setShowVeins, showArteries, setShowArteries, graphActive, setGraphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions, showAdvancedSliceControls, setShowAdvancedSliceControls, sliceEnabled = false}: { showVeins?: boolean, setShowVeins?: (value: boolean) => void, showArteries?: boolean, setShowArteries?: (value: boolean) => void, graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void, showAdvancedSliceControls: boolean, setShowAdvancedSliceControls: (v: boolean) => void,sliceEnabled?: boolean}) {
    const { pathname } = useLocation()
    const isHeartPage = isHeartPagePath(pathname)


    const navigate = useNavigate()
    const { setIsPaused } = useHeartMonitor()
    const isNavigating = useRef(false)
    const hasAppliedTheme = useRef(false)
    const [themePreference, setThemePreference] = useState<"system" | "light" | "dark">(() => {
        const saved = localStorage.getItem("theme-preference")
        return saved === "light" || saved === "dark" ? saved : "system"
    })
    const [systemIsDark, setSystemIsDark] = useState(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches
    )
    const isDark = themePreference === "system" ? systemIsDark : themePreference === "dark"
    const setIsDark = (dark: boolean) => {
        const preference = dark ? "dark" : "light"
        localStorage.setItem("theme-preference", preference)
        setThemePreference(preference)
    }

    useEffect(() => {
        const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
        const handleBrowserThemeChange = (event: MediaQueryListEvent) => {
            setSystemIsDark(event.matches)
        }

        browserTheme.addEventListener("change", handleBrowserThemeChange)
        return () => browserTheme.removeEventListener("change", handleBrowserThemeChange)
    }, [])

    useLayoutEffect(() => {
        const theme = isDark ? "dark" : "light"
        const root = document.documentElement

        if (hasAppliedTheme.current) {
            root.classList.add("theme-transition")
        }

        root.dataset.theme = theme
        hasAppliedTheme.current = true

        const timeout = window.setTimeout(() => {
            root.classList.remove("theme-transition")
        }, 260)

        return () => window.clearTimeout(timeout)
    }, [isDark])

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

            window.requestAnimationFrame(() => {
                setIsPaused(false)
                isNavigating.current = false
            })
        }, 50)
    }

    return (
        <header className="topbar" onClickCapture={handleTopBarNavigation}>
            <div className="logo">
                <img
                    className="logo-light"
                    src="/images/ABI_logo_blue.png"
                    alt="ABI logo"
                />

                <img
                    className="logo-dark"
                    src="/images/ABI_logo_white.png"
                    alt=""
                    aria-hidden="true"
                />
            </div>
            <div className="desktop_navigation">
                <HomeButton complexity={complexity} isHeartPage={isHeartPage} />
                <ImagingButton />
                <AboutButton />
                {isHeartPage && <SettingsButton
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
                    showVeins={showVeins}
                    setShowVeins={setShowVeins}
                    showArteries={showArteries}
                    setShowArteries={setShowArteries}
                    isDark={isDark}
                    setIsDark={setIsDark}
                    sliceEnabled={sliceEnabled}
                />}
                {!isHeartPage && (
                    <div className="desktop_theme">
                        <ThemeButton isDark={isDark} setIsDark={setIsDark} />
                    </div>
                )}
            </div>
            <div className="mobile_settings">
                {isHeartPage && (
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
                        showVeins={showVeins}
                        setShowVeins={setShowVeins}
                        showArteries={showArteries}
                        setShowArteries={setShowArteries}
                        isDark={isDark}
                        setIsDark={setIsDark}
                        sliceEnabled={sliceEnabled}
                    />
                )}
                {!isHeartPage && <ThemeButton isDark={isDark} setIsDark={setIsDark} />}
            </div>
            <div className="mobile_navigation">
                <HomeButton complexity={complexity} isHeartPage={isHeartPage} />
                <ImagingButton />
                <AboutButton />
            </div>
        </header>

    )
}

function SettingsButton({showVeins, setShowVeins, showArteries, setShowArteries, setGraphActive, graphActive, glowActive, setGlowActive, complexity, setComplexity, showDescriptions, setShowDescriptions, showAdvancedSliceControls, setShowAdvancedSliceControls, isDark, setIsDark, sliceEnabled}:
                        { showVeins?: boolean, setShowVeins?: (value: boolean) => void, showArteries?: boolean, setShowArteries?: (value: boolean) => void, graphActive: boolean, setGraphActive: (v: boolean) => void, glowActive: boolean, setGlowActive: (v: boolean) => void, complexity: Complexity, setComplexity: (v: Complexity) => void, showDescriptions?: boolean, setShowDescriptions?: (value: boolean) => void, showAdvancedSliceControls: boolean, setShowAdvancedSliceControls: (v: boolean) => void, isDark: boolean, setIsDark: (value: boolean) => void, sliceEnabled: boolean}) {

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
            <Settings
                isOpen={isOpen}
                onClose={() => setOpen(false)}
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
                showVeins={showVeins}
                setShowVeins={setShowVeins}
                showArteries={showArteries}
                setShowArteries={setShowArteries}
                isDark={isDark}
                setIsDark={setIsDark}
                sliceEnabled={sliceEnabled}
            />
        </div>
    )
}

function ThemeButton({ isDark, setIsDark }: { isDark: boolean, setIsDark: (value: boolean) => void }) {
    return (
        <button
            type="button"
            className="nav_button theme_button"
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? "Use light mode" : "Use dark mode"}
            aria-pressed={isDark}
        >
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
                </svg>
            )}
            <span>{isDark ? "Light" : "Dark"}</span>
        </button>
    )
}

function HomeButton({ complexity, isHeartPage }: { complexity: Complexity, isHeartPage: boolean }) {
    return (
        <div className="home_button">
            <NavLink
                to={getHeartPath(complexity, "healthy", "Healthy")}
                end
                className={`nav_button${isHeartPage ? " active" : ""}`}
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

export default TopBar;
