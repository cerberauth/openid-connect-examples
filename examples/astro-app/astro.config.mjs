import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  vite: {
    // Astro only exposes PUBLIC_* variables by default. VITE_* is also exposed
    // to stay consistent with the other SPA examples and their deployment setup.
    envPrefix: ['PUBLIC_', 'VITE_'],
    plugins: [tailwindcss()],
  },
})
