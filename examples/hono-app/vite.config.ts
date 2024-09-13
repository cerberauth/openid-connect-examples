import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
  plugins: [
    tailwindcss(),
    cloudflare(),
    ssrPlugin(),
  ]
})
