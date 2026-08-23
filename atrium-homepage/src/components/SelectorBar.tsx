import "./SelectorBar.css"
import { useState } from "react"

function SelectorBar() {
    const [active, setActive] = useState("heart")
    const toggles = [
        {id:"heart", label:"A"},
        {id:"attack", label:"B"},
        {id:"electricity", label:"C"}
    ]

    return (
        <header className="nav_bar">
            {toggles.map(opt => (
                <button id={opt.id}
                        className={active === opt.id ? "active" : "inactive"}
                        onClick={() => setActive(opt.id)}>
                    {opt.label}
                </button>
            ))}
        </header>
    )
}

export default SelectorBar;