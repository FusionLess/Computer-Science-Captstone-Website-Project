import "./LeftPanel.css"
import type {HeartState} from "../types/states.ts";

function LeftBox({active, setActive} :
                 {active: HeartState, setActive: (v: HeartState) => void}) {
    return (
        <aside className="left box">
            <HeartButtons active={active} setActive={setActive} />
            <div className="compare_button">
            </div>
        </aside>
    )
}

function HeartButtons({active, setActive} :
                      {active: HeartState, setActive: (v: HeartState) => void}) {
    const toggles: { id: HeartState; label: string }[] = [
        {id:"healthy", label:"Healthy"},
        {id:"attack", label:"Heart Attack"},
        {id:"electricity", label:"Electricity"}
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
            <button className="compare_button">Compare</button>
        </div>
    )
}

export default LeftBox