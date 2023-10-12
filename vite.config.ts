const isP = process.env.NODE_ENV === 'production';
import { defineConfig } from 'vite'
import url from 'url'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/hernadi-search.js`,
        chunkFileNames: `assets/hernadi-search.js`,
        assetFileNames: `assets/hernadi-search.[ext]`
      }
    }
  }
})