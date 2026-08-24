import "./Content.css"

function Content() {
    return (
        <main className="content">
            <LeftBox />
            <MiddleBox />
            <RightBox />
        </main>
    )
}

function LeftBox() {
    return (
        <aside className="left box">

        </aside>
    )
}

function MiddleBox() {
    return (
        <aside className="middle box">

        </aside>
    )
}

function RightBox() {
    return (
        <aside className="right box">
            
        </aside>
    )
}


export default Content