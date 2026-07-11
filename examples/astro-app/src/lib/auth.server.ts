import { createHmac, timingSafeEqual } from 'node:crypto'
import type { AstroCookies } from 'astro'
import { OAuth2Client, decodeIdToken } from 'arctic'

export type User = {
  sub: string
  name?: string
  email?: string
  picture?: string
}

const ISSUER = 'https://testid.cerberauth.com'
const SESSION_COOKIE = 'session'

type DiscoveryDocument = {
  authorization_endpoint: string
  token_endpoint: string
}

let discoveryPromise: Promise<DiscoveryDocument> | undefined

// Fetched lazily (not at module load) so a slow/unavailable provider never
// blocks the server from starting.
async function discover(): Promise<DiscoveryDocument> {
  if (!discoveryPromise) {
    discoveryPromise = fetch(`${ISSUER}/.well-known/openid-configuration`).then((res) => res.json())
  }

  return discoveryPromise
}

export async function getOAuthClient() {
  const { authorization_endpoint, token_endpoint } = await discover()

  const client = new OAuth2Client(
    import.meta.env.AUTH_CLIENT_ID,
    import.meta.env.AUTH_CLIENT_SECRET,
    import.meta.env.AUTH_REDIRECT_URI ?? 'http://localhost:4321/api/auth/callback',
  )

  return { client, authorizationEndpoint: authorization_endpoint, tokenEndpoint: token_endpoint }
}

export function decodeUser(idToken: string): User {
  const claims = decodeIdToken(idToken) as User

  return {
    sub: claims.sub,
    name: claims.name,
    email: claims.email,
    picture: claims.picture,
  }
}

// The session cookie is HMAC-signed so a user can't forge the claims it
// carries (e.g. swap their own sub/email) since we don't keep server-side
// session storage in this example.
function sign(value: string): string {
  const secret = import.meta.env.AUTH_SECRET ?? 'secret'
  const signature = createHmac('sha256', secret).update(value).digest('base64url')
  return `${value}.${signature}`
}

function unsign(signed: string): string | null {
  const secret = import.meta.env.AUTH_SECRET ?? 'secret'
  const separatorIndex = signed.lastIndexOf('.')
  if (separatorIndex < 0) return null

  const value = signed.slice(0, separatorIndex)
  const signature = Buffer.from(signed.slice(separatorIndex + 1))
  const expectedSignature = Buffer.from(createHmac('sha256', secret).update(value).digest('base64url'))

  if (signature.length !== expectedSignature.length || !timingSafeEqual(signature, expectedSignature)) {
    return null
  }

  return value
}

const isProduction = import.meta.env.PROD

export function setUserSession(cookies: AstroCookies, user: User) {
  cookies.set(SESSION_COOKIE, sign(JSON.stringify(user)), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 60 * 60 * 24,
  })
}

export function getUserSession(cookies: AstroCookies): User | null {
  const cookie = cookies.get(SESSION_COOKIE)?.value
  if (!cookie) return null

  const value = unsign(cookie)
  if (!value) return null

  return JSON.parse(value) as User
}

export function clearUserSession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' })
}
