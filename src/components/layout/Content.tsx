    import "./Content.css"
    import LeftBox from "./LeftPanel.tsx"
    import type {HeartState} from "../types/states.ts";
    import HealthyHeart from "../hearts/HealthyHeart.tsx";
    import HeartAttack from "../hearts/HeartAttack.tsx";
    import ElectricityHeart from "../hearts/ElectricityHeart.tsx";
    import {useState} from "react";

function Content({active, setActive} : {active: HeartState, setActive: (v: HeartState) => void}) {

    return (
        <main className="content">
            <LeftBox active={active} setActive={setActive} />
            <MiddleBox active={active}/>
            <RightBox />
        </main>
    )
}

const views = {
    healthy: <HealthyHeart/>,
    attack: <HeartAttack/>,
    electricity: <ElectricityHeart/>
};

function MiddleBox({active} : {active: HeartState}) {

    return (
        <>
            <aside className="middle box">
                <div className="mask"></div>
                {views[active] || views["healthy"]}
            </aside>
        </>
    )
}

function RightBox() {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <aside className = "right box">
            <button onClick={() => setIsOpen(false)}>»</button>
            {isOpen && <div className = "right_content"/>}
            <div className = "right_content">
            [ Heart State Description ]
            </div>
        </aside>
    )
}


export default Content