import './App.css'
import HomePage from './pages/HomePage'
import { HeartMonitorProvider } from './components/context/HeartMonitorContext'

export default function App() {
    return (
        <HeartMonitorProvider>
            <HomePage />
        </HeartMonitorProvider>
    );
}