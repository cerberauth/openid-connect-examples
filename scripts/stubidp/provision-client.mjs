#!/usr/bin/env node
// Creates or updates (get-or-create, RFC 7591/7592) a single OAuth client on
// stubIdP for one app listed in .github/stubidp/clients.json. Intended to run
// from .github/workflows/provision-stubidp-clients.yml, not locally.
import { readFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clients = JSON.parse(readFileSync(path.join(__dirname, '../../.github/stubidp/clients.json'), 'utf8'))

const clientKey = process.env.CLIENT_KEY
const issuer = process.env.STUBIDP_ISSUER || 'https://stubidp.cerberauth.com'
const initialAccessToken = process.env.STUBIDP_REGISTRATION_INITIAL_ACCESS_TOKEN
const existingClientId = process.env.EXISTING_CLIENT_ID || ''
const existingRegistrationAccessToken = process.env.EXISTING_REGISTRATION_ACCESS_TOKEN || ''

const config = clients.find((c) => c.key === clientKey)
if (!config) {
  console.error(`Unknown client key: ${clientKey}`)
  process.exit(1)
}

const desiredMetadata = {
  client_name: config.clientName,
  redirect_uris: config.redirectUris,
  post_logout_redirect_uris: config.postLogoutRedirectUris,
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: config.public ? 'none' : 'client_secret_basic',
}

function setOutput(name, value) {
  if (value === undefined || value === null) return
  if (process.env.GITHUB_OUTPUT) {
    const delimiter = `ghadelimiter_${Math.random().toString(36).slice(2)}`
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${value}\n${delimiter}\n`)
  }
}

function maskInLogs(value) {
  if (value) console.log(`::add-mask::${value}`)
}

async function tryUpdateExisting() {
  if (!existingClientId || !existingRegistrationAccessToken) return null

  const getRes = await fetch(`${issuer}/reg/${existingClientId}`, {
    headers: { Authorization: `Bearer ${existingRegistrationAccessToken}` },
  })
  if (!getRes.ok) {
    console.log(`Existing client ${existingClientId} could not be read (HTTP ${getRes.status}); re-registering.`)
    return null
  }
  const current = await getRes.json()

  const putBody = { ...current, ...desiredMetadata }
  const putRes = await fetch(current.registration_client_uri ?? `${issuer}/reg/${existingClientId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${existingRegistrationAccessToken}`,
    },
    body: JSON.stringify(putBody),
  })
  if (!putRes.ok) {
    console.log(`Failed to update existing client ${existingClientId} (HTTP ${putRes.status}); re-registering.`)
    return null
  }
  return { ...(await putRes.json()), created: false }
}

async function createNew() {
  if (!initialAccessToken) {
    throw new Error(
      'No existing client to update and STUBIDP_REGISTRATION_INITIAL_ACCESS_TOKEN is not set; cannot register a new client.',
    )
  }
  const res = await fetch(`${issuer}/reg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${initialAccessToken}`,
    },
    body: JSON.stringify(desiredMetadata),
  })
  if (!res.ok) {
    throw new Error(`Failed to register client "${clientKey}": HTTP ${res.status} - ${await res.text()}`)
  }
  return { ...(await res.json()), created: true }
}

const result = (await tryUpdateExisting()) ?? (await createNew())

maskInLogs(result.client_secret)
maskInLogs(result.registration_access_token)

setOutput('client_id', result.client_id)
setOutput('client_secret', result.client_secret ?? '')
setOutput('registration_access_token', result.registration_access_token)
setOutput('registration_client_uri', result.registration_client_uri)
setOutput('created', String(result.created))

console.log(
  `${result.created ? 'Registered new' : 'Updated existing'} client for "${clientKey}": ${result.client_id}`,
)
