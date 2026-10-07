import './App.css'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage.tsx'
import { HeartMonitorProvider } from './components/context/HeartMonitorContext'
import { BrowserRouter, Routes, Route } from 'react-router';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <HeartMonitorProvider>
                        <HomePage />
                    </HeartMonitorProvider>
                }/>
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </BrowserRouter>
    );
}