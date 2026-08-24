import './App.css'
import SelectBar from './components/TopBar.tsx'
import Content from './components/Content.tsx'
import GraphBar from './components/GraphBar.tsx'

function App() {

  return (
      <main className="app">
        <SelectBar />
        <Content />
        <GraphBar />
      </main>
  )
}

export default App