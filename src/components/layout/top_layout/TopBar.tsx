import "./TopBar.css"
import SidePanel from "./SidePanel.tsx"
import { useState } from "react"

function TopBar({graphActive, setGraphActive}:{graphActive:boolean, setGraphActive:(v : boolean)=>void}) {
    return (
        <header className="topbar">
            <LeftButtons setGraphActive={setGraphActive} graphActive={graphActive}/>
            <div className="logo">
                [ Project Atrium ]
            </div>
            <RightButtons />
        </header>

    )
}

function LeftButtons({setGraphActive, graphActive}:{graphActive:boolean, setGraphActive:(v : boolean)=>void}) {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className = "left_buttons">
            <button onClick={() => setOpen(!isOpen)} className={(isOpen ? "active" : "inactive")} >
                ≡
            </button>
            {isOpen && <div className="backdrop" onClick={() => setOpen(false)} />}
            <SidePanel isOpen={isOpen} setGraphActive={setGraphActive} graphActive={graphActive}/>
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