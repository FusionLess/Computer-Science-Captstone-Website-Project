import "./TopBar.css"
import SidePanel from "./SidePanel.tsx"
import { useState } from "react"

function TopBar({active, setActive}) {
    return (
        <header className="topbar">
            <LeftButtons />
            <HeartButtons active={active} setActive={setActive} />
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

function HeartButtons({active, setActive}) {
    const toggles = [
        {id:"healthy", label:"A"},
        {id:"attack", label:"B"},
        {id:"electricity", label:"C"}
    ]

    return (
        <div className="toggle_buttons">
            {toggles.map(opt => (
                <button id={opt.id}
                        className={active === opt.id ? "active" : "inactive"}
                        onClick={() => setActive(opt.id)}>
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

export default TopBar;