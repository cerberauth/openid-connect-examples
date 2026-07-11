import 'dotenv/config'
import { createCookieSessionStorage } from 'react-router'
import { Authenticator } from 'remix-auth'
import { CodeChallengeMethod, OAuth2Strategy } from 'remix-auth-oauth2'
import { decodeIdToken } from 'arctic'

export type User = {
  sub: string
  name?: string
  email?: string
  picture?: string
}

export const sessionStorage = createCookieSessionStorage<{ user: User }>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.AUTH_SECRET || 'secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

// OAuth2Strategy.discover() fetches the provider's /.well-known/openid-configuration,
// so it needs to run lazily behind a promise instead of at module load time
// (a top-level await here breaks the SSR build's esbuild target).
let authenticatorPromise: Promise<Authenticator<User>> | undefined

async function createAuthenticator() {
  const authenticator = new Authenticator<User>()

  authenticator.use(
    await OAuth2Strategy.discover<User>(
      'https://testid.cerberauth.com',
      {
        clientId: process.env.AUTH_CLIENT_ID!,
        clientSecret: process.env.AUTH_CLIENT_SECRET!,
        redirectURI: process.env.AUTH_REDIRECT_URI ?? 'http://localhost:5173/auth/callback',
        scopes: ['openid', 'profile', 'email'],
        codeChallengeMethod: CodeChallengeMethod.S256,
      },
      async ({ tokens }) => {
        const claims = decodeIdToken(tokens.idToken()) as {
          sub: string
          name?: string
          email?: string
          picture?: string
        }

        return {
          sub: claims.sub,
          name: claims.name,
          email: claims.email,
          picture: claims.picture,
        }
      },
    ),
    'testid',
  )

  return authenticator
}

export function getAuthenticator() {
  if (!authenticatorPromise) {
    authenticatorPromise = createAuthenticator()
  }

  return authenticatorPromise
}

export async function getUser(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'))
  return session.get('user')
}
