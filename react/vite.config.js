import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Transmettre tous les headers personnalisés
            if (req.headers['x-user-email']) {
              proxyReq.setHeader('X-User-Email', req.headers['x-user-email']);
            }
          });
        },
      },
    },
  },
})
