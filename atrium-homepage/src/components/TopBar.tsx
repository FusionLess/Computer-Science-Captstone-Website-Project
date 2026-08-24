import "./TopBar.css"
import SidePanel from "./SidePanel.tsx"
import { useState } from "react"

function TopBar() {
    return (
        <header className="topbar">
            <PanelButton />
            <HeartButtons />
            <RightButtons />
        </header>
    )
}

function PanelButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className={(isOpen ? "active" : "inactive")} >
                ≡
            </button>
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}
            <SidePanel isOpen={isOpen} />
        </>
    )
}

function RightButtons() {
    return (
        <>

        </>
    )
}

function HeartButtons(){
    const [active, setActive] = useState("heart")
    const toggles = [
        {id:"heart", label:"A"},
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