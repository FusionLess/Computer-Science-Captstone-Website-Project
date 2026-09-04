import "./SidePanel.css"

function SidePanel({isOpen}: { isOpen : boolean}) {
    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        </aside>
    )
}

export default SidePanel;