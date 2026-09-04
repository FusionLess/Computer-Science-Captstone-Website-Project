    import "./Content.css"
    import LeftBox from "./LeftPanel.tsx"
    import type {HeartState} from "../../types/states.ts";
    import HealthyHeart from "../../hearts/HealthyHeart.tsx";
    import HeartAttack from "../../hearts/HeartAttack.tsx";
    import ElectricityHeart from "../../hearts/ElectricityHeart.tsx";
    import RightBox from "./RightPanel.tsx";
    import HeartFailure from "../../hearts/HeartFailure.tsx";

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
    electricity: <ElectricityHeart/>,
    failure: <HeartFailure/>
};

function MiddleBox({active} : {active: HeartState}) {

    return (
        <>
            <aside className="middle box">
                <div className="mask"></div>
                {views[active.category]}
            </aside>
        </>
    )
}

export default Content