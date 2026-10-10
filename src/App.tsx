import './App.css'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage.tsx'
import ImagingPage from './pages/ImagingPage.tsx'
import { HeartMonitorProvider } from './components/context/HeartMonitorContext'
import { BrowserRouter, Routes, Route } from 'react-router';

export default function App() {
    return (
        <BrowserRouter>
            <HeartMonitorProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                <Route path="/:complexity/:category/:option" element={
                    <HeartMonitorProvider>
                        <HomePage />
                    </HeartMonitorProvider>
                }/>
                <Route path="/:complexity/compare/:first/:second" element={
                    <HeartMonitorProvider>
                        <HomePage />
                    </HeartMonitorProvider>
                }/>
                <Route
                    path="/imaging/:mode"
                    element={
                        <HeartMonitorProvider>
                            <ImagingPage />
                        </HeartMonitorProvider>
                    }
                />
            </Routes>
            </HeartMonitorProvider>
        </BrowserRouter>
    );
}