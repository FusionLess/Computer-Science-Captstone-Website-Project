import {useState} from "react";
import "./RightPanel.css"
import HeartPartInfo from "../HeartPartInfo";
function RightBox({selectedPart} : {selectedPart: string | null}) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <aside className = "right box">
            { isOpen && <button className="right_collapse" onClick={() => setIsOpen(!isOpen)}> » </button>}
            { !isOpen && <button className="right_open" onClick={() => setIsOpen(!isOpen)}> « </button>}
            <div className = {`right_content ${isOpen ? "" : "closed"}`}>
                <div className="heart_state_info">

                    [ Heart State Description ]
                </div>
                <HeartPartInfo selectedPart={selectedPart} />

            </div>
        </aside>
    )
}

export default RightBox;