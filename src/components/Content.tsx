    import "./Content.css"
    import LeftBox from "./LeftPanel.tsx"
    import "./states.ts"
    import type {HeartState} from "./states.ts";

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
    healthy: <> This is the healthy heart viewer</>, // You probably would want a separate component for heart states
    attack: <> This is the heart attack viewer</>, // We would probably also need more heart states
    electricity: <> This is the electricity heart viewer</> // heart failure , severe heart attacks etc.
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