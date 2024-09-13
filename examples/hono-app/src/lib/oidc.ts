import {
  authorizationCodeGrantRequest,
  type AuthorizationServer,
  calculatePKCECodeChallenge,
  Client,
  ClientSecretBasic,
  generateRandomCodeVerifier,
  generateRandomNonce,
  generateRandomState,
  getValidatedIdTokenClaims,
  processAuthorizationCodeResponse,
  validateAuthResponse,
} from 'oauth4webapi'
import { decode } from '@tsndr/cloudflare-worker-jwt'

export type User = {
  id: string
  name: string
  email: string
  picture?: string
}

type LoginParams = {
  as: AuthorizationServer
  client: Client
  redirectUrl: string
}

export const login = async ({ as, client, redirectUrl }: LoginParams) => {
  const codeChallengeMethod = 'S256'
  const codeVerifier = generateRandomCodeVerifier()

  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)
  const authorizationUrl = new URL(as.authorization_endpoint!)
  authorizationUrl.searchParams.set('client_id', client.client_id)
  authorizationUrl.searchParams.set('redirect_uri', redirectUrl)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', 'openid offline_access profile email')
  authorizationUrl.searchParams.set('code_challenge', codeChallenge)
  authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod)

  const state = generateRandomState()
  authorizationUrl.searchParams.set('state', state)

  let nonce: string | undefined
  if (as.code_challenge_methods_supported?.includes('S256') !== true) {
    nonce = generateRandomNonce()
    authorizationUrl.searchParams.set('nonce', nonce)
  }

  return {
    codeVerifier,
    state,
    nonce,
    authorizationUrl,
  }
}

type CallbackParams = {
  as: AuthorizationServer
  client: Client
  clientSecret: string
  redirectUrl: string
  url: string
  codeVerifier: string
  state?: string
  nonce?: string
}

export const processCallback = async ({ as, client, clientSecret, redirectUrl, url, codeVerifier, state, nonce }: CallbackParams) => {
  const clientAuth = ClientSecretBasic(clientSecret)

  const params = validateAuthResponse(as, client, new URL(url), state)
  const response = await authorizationCodeGrantRequest(
    as,
    client,
    clientAuth,
    params,
    redirectUrl,
    codeVerifier,
  )

  const result = await processAuthorizationCodeResponse(as, client, response, {
    expectedNonce: nonce,
    requireIdToken: true,
  })

  getValidatedIdTokenClaims(result)

  return {
    expiresIn: result.expires_in,
    accessToken: result.access_token,
    idToken: result.id_token,
    refreshToken: result.refresh_token,
  }
}

type LogoutParams = {
  as: AuthorizationServer
  client: Client
  redirectUrl: string
  idToken: string
}

export const logout = async ({ as, client, redirectUrl, idToken }: LogoutParams) => {
  const endSessionUrl = new URL(as.end_session_endpoint!)
  endSessionUrl.searchParams.set('client_id', client.client_id)
  endSessionUrl.searchParams.set('id_token_hint', idToken)
  endSessionUrl.searchParams.set('post_logout_redirect_uri', redirectUrl.toString())

  return endSessionUrl
}

export const getUser = ({ idToken }: { idToken?: string }): User | undefined => {
  if (!idToken) {
    return undefined
  }

  const claims = decode<Omit<User, 'id'>>(idToken)
  if (!claims || typeof claims.payload !== 'object' || !claims.payload.sub) {
    return undefined;
  }

  return {
    id: claims.payload.sub,
    name: claims.payload.name,
    email: claims.payload.email as string,
    picture: claims.payload.picture as string,
  }
}
