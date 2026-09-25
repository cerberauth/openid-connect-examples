#!/usr/bin/env node
// Idempotently creates or updates Vercel project env vars (encrypted,
// production + preview) via the Vercel REST API. Used by
// provision-stubidp-clients.yml to push a freshly (re)provisioned stubIdP
// client's credentials into a Vercel-deployed app.
const project = process.env.VERCEL_PROJECT
const token = process.env.VERCEL_TOKEN
const teamId = process.env.VERCEL_TEAM_ID || ''
const vars = {
  AUTH_CLIENT_ID: process.env.CLIENT_ID || '',
  AUTH_CLIENT_SECRET: process.env.CLIENT_SECRET || '',
}

if (!project || !token) {
  console.error('VERCEL_PROJECT and VERCEL_TOKEN are required')
  process.exit(1)
}

const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : ''

async function vercelFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`${options.method ?? 'GET'} ${url} failed: HTTP ${res.status} - ${await res.text()}`)
  }
  return res.json()
}

const { envs: existing } = await vercelFetch(`https://api.vercel.com/v9/projects/${project}/env${query}`)

for (const [key, value] of Object.entries(vars)) {
  if (!value) {
    console.log(`Skipping ${key} (empty value)`)
    continue
  }

  const match = existing.find((e) => e.key === key)
  const body = {
    key,
    value,
    type: 'encrypted',
    target: ['production', 'preview'],
  }

  if (match) {
    await vercelFetch(`https://api.vercel.com/v9/projects/${project}/env/${match.id}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    console.log(`Updated Vercel env var ${key} on ${project}`)
  } else {
    await vercelFetch(`https://api.vercel.com/v10/projects/${project}/env${query}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    console.log(`Created Vercel env var ${key} on ${project}`)
  }
}
