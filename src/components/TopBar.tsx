import "./TopBar.css"
import SidePanel from "./SidePanel.tsx"
import { useState } from "react"

function TopBar() {
    return (
        <header className="topbar">
            <LeftButtons />
            {/*<HeartButtons active={active} setActive={setActive} />*/}
            <RightButtons />
        </header>
    )
}

function LeftButtons() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className = "left_buttons">
            <button onClick={() => setIsOpen(!isOpen)} className={(isOpen ? "active" : "inactive")} >
                ≡
            </button>
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}
            <SidePanel isOpen={isOpen} />
            <div className="logo">
                [ Project Atrium ]
            </div>
        </div>
    )
}

function RightButtons() {
    return (
        <>
        </>
    )
}

export default TopBar;