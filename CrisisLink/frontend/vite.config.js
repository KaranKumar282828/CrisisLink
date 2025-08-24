import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: env.VITE_APP_NAME || 'ResQLink',
          short_name: 'ResQLink',
          description: 'Real-time emergency response platform',
          theme_color: '#dc2626',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: '/icon-72.png',
              sizes: '72x72',
              type: 'image/png'
            },
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      }),
      mode === 'analyze' && visualizer({
        filename: 'dist/stats.html',
        open: true
      })
    ],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false
        },
        '/socket.io': {
          target: env.VITE_SOCKET_URL,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            maps: ['leaflet', 'react-leaflet'],
            charts: ['chart.js', 'react-chartjs-2'],
            utils: ['axios', 'socket.io-client']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || 'ResQLink')
    }
  };
});