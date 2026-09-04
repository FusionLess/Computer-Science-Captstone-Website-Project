import {useState} from "react";
import "./RightPanel.css"

function RightBox() {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <aside className = "right box">
            { isOpen && <button className="right_collapse" onClick={() => setIsOpen(!isOpen)}> » </button>}
            { !isOpen && <button className="right_open" onClick={() => setIsOpen(!isOpen)}> « </button>}
            <div className = {`right_content ${isOpen ? "" : "closed"}`}>
                [ Heart State Description ]
            </div>
        </aside>
    )
}

export default RightBox;