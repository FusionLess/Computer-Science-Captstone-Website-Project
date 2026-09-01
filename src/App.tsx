import './App.css'
import HomePage from './pages/HomePage'
import HeartViewerPage from "./pages/HeartViewerPage.tsx";

export default function App() {
    return window.location.pathname === '/viewer'
        ? <HeartViewerPage />
        : <HomePage />
}