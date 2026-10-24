import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// GitHub Pages serves this project under /restaurant-pos/.
export default defineConfig({
  base: '/restaurant-pos/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
