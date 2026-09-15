import "./SidePanel.css"
import {useState} from "react";

function SidePanel({isOpen, graphActive, setGraphActive}:
                   { isOpen : boolean, graphActive:boolean, setGraphActive:(v : boolean)=>void}) {
    const [complexity, setComplexity] = useState<string>("standard")

    const complexities = [
        {id:"basic", label: "Basic"},
        {id:"standard", label: "Standard"},
        {id:"advanced", label: "Advanced"},
    ]

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <h4>Select Complexity Level</h4>
            <div className="complexity_selector">
                {
                    complexities.map((c) => (
                        <button
                            id={c.id}
                            key={c.id}
                            className={c.id === complexity ? 'active': 'inactive'}
                            onClick={() => setComplexity(c.id)}
                        >
                            {c.label}
                        </button>
                    ))
                }
            </div>
            <h4></h4>
            <div className="advanced_options">
                <button onClick={() => setGraphActive(!graphActive)}> Toggle Graphs</button>
            </div>
            <div className="theme_selector">
                <button>◐</button>
            </div>
        </aside>
    )
}

export default SidePanel;