import "./AboutLayout.css"

export default function AboutLayout () {
    return (
        <main className="about_layout">
            <AboutLeft />
            <AboutMain />
        </main>
    )
}

function AboutLeft () {
    return (
        <aside className="left column">
            <button>
                UoA
            </button>
            <button>
                Software
            </button>

        </aside>
    )
}

function AboutMain () {
    return (
        <aside className="main column">
            Hi
        </aside>
    )
}
