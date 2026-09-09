import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from '@cloudflare/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    // this is the plugin that enables the `~/*` path alias, see tsconfig.json
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      // This example is a client-side authenticated SPA, no SSR needed.
      spa: {
        enabled: true,
        prerender: {
          // Rename the generated shell so it doubles as the SPA's index.html,
          // which Cloudflare's `not_found_handling: single-page-application` expects.
          outputPath: '/index.html',
        },
      },
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
  ],
})
