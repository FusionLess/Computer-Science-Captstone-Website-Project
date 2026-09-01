    import "./Content.css"
    import LeftBox from "./LeftPanel.tsx"
    import type {HeartState} from "../types/states.ts";
    import HealthyHeart from "../hearts/HealthyHeart.tsx";
    import HeartAttack from "../hearts/HeartAttack.tsx";
    import ElectricityHeart from "../hearts/ElectricityHeart.tsx";

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
        <aside className="middle box">
            [ 3D Interactive Heart ]
            {views[active] || views["healthy"]}
        </aside>
    )
}

function RightBox() {
    return (
        <aside className="right box">
            [ Heart State Description ]
        </aside>
    )
}


export default Content