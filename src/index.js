import React from 'react';
import { createRoot } from 'react-dom/client';

// Styles
import './index.css';

// Components
import App from './components/App';

// Mount app
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);

export default App;