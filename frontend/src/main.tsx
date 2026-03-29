import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const CHUNK_RELOAD_KEY = 'aura:chunk-reload-once'

const triggerSingleReload = (): void => {
    try {
        if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
            sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
            window.location.reload()
        }
    } catch {
        window.location.reload()
    }
}

// Recover automatically when a stale cached HTML references deleted hashed chunks.
window.addEventListener('error', (event) => {
    const message = String((event as ErrorEvent).message || '')
    if (message.includes('Failed to fetch dynamically imported module')) {
        triggerSingleReload()
    }
})

window.addEventListener('unhandledrejection', (event) => {
    const reason = (event as PromiseRejectionEvent).reason
    const message = String(reason?.message || reason || '')
    if (message.includes('Failed to fetch dynamically imported module')) {
        triggerSingleReload()
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

try {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY)
} catch {
    // noop
}

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.update())
    }).catch(() => {
        // noop
    })

    navigator.serviceWorker.register('/Aura/sw.js', { scope: '/Aura/' }).catch(err => {
        console.log('Service worker registration failed:', err);
    });
}
