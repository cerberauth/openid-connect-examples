import type { APIRoute } from 'astro'
import { OAuth2RequestError } from 'arctic'

import { decodeUser, getOAuthClient, setUserSession } from '../../../lib/auth.server'

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies.get('oauth_state')?.value
  const codeVerifier = cookies.get('oauth_code_verifier')?.value

  cookies.delete('oauth_state', { path: '/' })
  cookies.delete('oauth_code_verifier', { path: '/' })

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return redirect('/')
  }

  const { client, tokenEndpoint } = await getOAuthClient()

  try {
    const tokens = await client.validateAuthorizationCode(tokenEndpoint, code, codeVerifier)
    const user = decodeUser(tokens.idToken())
    setUserSession(cookies, user)
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      return redirect('/')
    }
    throw error
  }

  return redirect('/')
}
