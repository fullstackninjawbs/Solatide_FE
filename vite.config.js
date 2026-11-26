/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'

// App version (package.json, semantic versioning: see CHANGELOG.md) + git commit, built into the
// bundle as __APP_VERSION__ / __APP_COMMIT__ (for AdminVersionLabel; not shown in the UI at the moment)
const APP_VERSION = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version
const APP_COMMIT = (() => {
  if (/^[0-9a-f]{7,40}$/i.test(process.env.APP_COMMIT || '')) return process.env.APP_COMMIT.slice(0, 7)
  try { return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return 'unknown' }
})()

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __APP_COMMIT__: JSON.stringify(APP_COMMIT),
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'swiper', 'framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssMinify: true,
    minify: 'esbuild',
  }
})
