import type { APIRoute } from 'astro'
import { CodeChallengeMethod, generateCodeVerifier, generateState } from 'arctic'

import { getOAuthClient } from '../../../lib/auth.server'

const isProduction = import.meta.env.PROD

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const { client, authorizationEndpoint } = await getOAuthClient()

  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = client.createAuthorizationURLWithPKCE(
    authorizationEndpoint,
    state,
    CodeChallengeMethod.S256,
    codeVerifier,
    ['openid', 'profile', 'email'],
  )

  const tempCookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: isProduction,
    maxAge: 600,
  }
  cookies.set('oauth_state', state, tempCookieOptions)
  cookies.set('oauth_code_verifier', codeVerifier, tempCookieOptions)

  return redirect(url.toString())
}
