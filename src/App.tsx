import './App.css'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
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
            </Routes>
        </BrowserRouter>
    );
}