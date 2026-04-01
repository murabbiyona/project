import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // GitHub Pages SPA routing: 404.html = index.html
        const dist = path.resolve(__dirname, 'dist')
        if (fs.existsSync(path.join(dist, 'index.html'))) {
          fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
        }
      },
    },
  ],
  base: '/project/',
})
