import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';

// Styles
import './index.css';

// Components
import App from './components/App';
import MainMenu from './components/game/MainMenu';

// Mount app
const container = document.getElementById('app');
const root = createRoot(container);
root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="game" element={<MainMenu />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </HashRouter>
);

export default App;