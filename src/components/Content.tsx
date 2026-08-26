import "./Content.css"

function Content({active}) {
    return (
        <main className="content">
            <LeftBox />
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

function LeftBox() {
    return (
        <aside className="left box">
            [ More Content ]
            (Perhaps click on a section of the heart to learn more about it here?)
        </aside>
    )
}

function MiddleBox({active}) {

    return (
        <aside className="middle box">
            [ 3D Interactive Heart ]
            {views[active] || views[healthy]}
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