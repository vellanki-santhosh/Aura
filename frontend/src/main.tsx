import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Aura/sw.js', { scope: '/Aura/' }).catch(err => {
        console.log('Service worker registration failed:', err);
    });
}
