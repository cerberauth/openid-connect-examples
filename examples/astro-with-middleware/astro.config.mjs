import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// The example can be deployed on Node.js (Docker), Cloudflare Workers and Vercel.
// The adapter is picked at build time: set ASTRO_ADAPTER, or let Vercel's own
// VERCEL variable select the Vercel adapter. Node.js is the default.
const adapterName = process.env.ASTRO_ADAPTER ?? (process.env.VERCEL ? 'vercel' : 'node')

const getAdapter = async () => {
  switch (adapterName) {
    case 'cloudflare':
      return (await import('@astrojs/cloudflare')).default()
    case 'vercel':
      return (await import('@astrojs/vercel')).default()
    default:
      return (await import('@astrojs/node')).default({ mode: 'standalone' })
  }
}

export default defineConfig({
  output: 'server',
  adapter: await getAdapter(),
  env: {
    schema: {
      BETTER_AUTH_SECRET: envField.string({ context: 'server', access: 'secret' }),
      BETTER_AUTH_URL: envField.string({ context: 'server', access: 'secret' }),
      AUTH_ISSUER: envField.string({ context: 'server', access: 'secret' }),
      AUTH_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      AUTH_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
