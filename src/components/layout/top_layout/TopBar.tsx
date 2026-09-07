import "./TopBar.css"
import SidePanel from "./SidePanel.tsx"
import { useState } from "react"

function TopBar() {
    return (
        <header className="topbar">
            <LeftButtons />
            <div className="logo">
                [ Project Atrium ]
            </div>
            <RightButtons />
        </header>

    )
}

function LeftButtons() {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className = "left_buttons">
            <button onClick={() => setOpen(!isOpen)} className={(isOpen ? "active" : "inactive")} >
                ≡
            </button>
            {isOpen && <div className="backdrop" onClick={() => setOpen(false)} />}
            <SidePanel isOpen={isOpen} />
        </div>
    )
}

function RightButtons() {
    return (
        <div className = "right_buttons">
            <button>about</button>
        </div>
    )
}

export default TopBar;