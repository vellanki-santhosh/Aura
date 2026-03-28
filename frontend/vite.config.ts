import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'AURA - Student Leadership Platform',
                short_name: 'AURA',
                description: 'Gamified platform for tracking campus contributions and student leadership',
                theme_color: '#2ECC71',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/Aura/',
                start_url: '/Aura/',
                icons: [
                    {
                        src: '/Aura/logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/Aura/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
                categories: ['education', 'productivity'],
                screenshots: [
                    {
                        src: '/Aura/logo.png',
                        sizes: '540x720',
                        type: 'image/png',
                        form_factor: 'narrow',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,lottie}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                        },
                    },
                ],
                clientsClaim: true,
                skipWaiting: true,
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    base: '/Aura/',
})
