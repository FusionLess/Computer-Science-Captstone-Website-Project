import './App.css'
import TopBar from './components/TopBar.tsx'
import Content from './components/Content.tsx'
import GraphBar from './components/GraphBar.tsx'
import {useState} from "react";

function App() {
    const [active, setActive] = useState("healthy")

    return (
      <main className="app">
        <TopBar active={active} setActive={setActive} />
        <Content active={active}/>
        <GraphBar />
      </main>
    )
}

export default App