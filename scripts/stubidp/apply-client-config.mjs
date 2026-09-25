#!/usr/bin/env node
// Writes a freshly (re)provisioned stubIdP client's issuer + client_id into
// the tracked, non-secret config file(s) for one app. Client secrets are
// never written to disk here — those go straight into the deployment
// target's own secret store (see provision-stubidp-clients.yml).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const clientKey = process.env.CLIENT_KEY
const issuer = process.env.STUBIDP_ISSUER || 'https://stubidp.cerberauth.com'
const clientId = process.env.CLIENT_ID
if (!clientKey || !clientId) {
  console.error('CLIENT_KEY and CLIENT_ID are required')
  process.exit(1)
}

function patch(file, replacements) {
  if (!existsSync(file)) {
    console.log(`Skipping ${file} (not found)`)
    return
  }
  let content = readFileSync(file, 'utf8')
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement)
  }
  writeFileSync(file, content)
  console.log(`Updated ${file}`)
}

// .env/.env.local keep commented-out alternative providers above the active
// line (see examples/react-spa/.env.local) - anchor to line-start so only the
// uncommented line is replaced, not those examples.
const viteEnvReplacements = [
  [/^VITE_OIDC_ISSUER="[^"]*"/m, `VITE_OIDC_ISSUER="${issuer}"`],
  [/^VITE_OIDC_CLIENT_ID="[^"]*"/m, `VITE_OIDC_CLIENT_ID="${clientId}"`],
]

switch (clientKey) {
  case 'react-spa':
    patch('examples/react-spa/.env', viteEnvReplacements)
    patch('examples/react-spa/.env.local', viteEnvReplacements)
    break
  case 'vue-spa':
    patch('examples/vue-spa/.env', viteEnvReplacements)
    patch('examples/vue-spa/.env.local', viteEnvReplacements)
    break
  case 'tanstack-start-app':
    patch('examples/tanstack-start-app/.env', viteEnvReplacements)
    patch('examples/tanstack-start-app/.env.local', viteEnvReplacements)
    break
  case 'angular-spa': {
    const replacements = [
      [/issuer: '[^']*'/, `issuer: '${issuer}'`],
      [/clientId: '[^']*'/, `clientId: '${clientId}'`],
    ]
    patch('examples/angular-spa/src/environments/environment.ts', replacements)
    patch('examples/angular-spa/src/environments/environment.development.ts', replacements)
    break
  }
  case 'hono-app':
    patch('examples/hono-app/.env.example', [
      [/AUTH_ISSUER="[^"]*"/, `AUTH_ISSUER="${issuer}"`],
      [/AUTH_CLIENT_ID="[^"]*"/, `AUTH_CLIENT_ID="${clientId}"`],
    ])
    patch('examples/hono-app/wrangler.jsonc', [
      [/"AUTH_ISSUER": "[^"]*"/, `"AUTH_ISSUER": "${issuer}"`],
      [/"AUTH_CLIENT_ID": "[^"]*"/, `"AUTH_CLIENT_ID": "${clientId}"`],
    ])
    break
  case 'nextjs-app':
    // AUTH_CLIENT_ID/SECRET are intentionally left blank in .env.example so
    // contributors register their own client; production credentials live
    // only in Vercel/Cloudflare Pages project settings.
    console.log('nextjs-app has no committed client_id to update')
    break
  default:
    console.error(`Unknown client key: ${clientKey}`)
    process.exit(1)
}
