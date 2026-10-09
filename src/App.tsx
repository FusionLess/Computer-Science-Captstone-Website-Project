import './App.css'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage.tsx'
import { HeartMonitorProvider } from './components/context/HeartMonitorContext'
import { BrowserRouter, Routes, Route } from 'react-router';

export default function App() {
    return (
        <BrowserRouter>
            <HeartMonitorProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </HeartMonitorProvider>
        </BrowserRouter>
    );
}