import "./SidePanel.css"

function SidePanel({isOpen}) {
    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        </aside>
    )
}

export default SidePanel;