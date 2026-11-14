import * as oauth from 'oauth4webapi'

const webStorageKey = 'oidc:auth'
let idToken: string | undefined

const getConfig = () => {
  const issuer = import.meta.env.VITE_OIDC_ISSUER
  const clientId = import.meta.env.VITE_OIDC_CLIENT_ID

  if (!issuer) {
    throw new Error('VITE_OIDC_ISSUER is not set')
  }
  if (!clientId) {
    throw new Error('VITE_OIDC_CLIENT_ID is not set')
  }

  const issuerUrl = new URL(issuer)
  return {
    issuerUrl,
    // Only for local development against a provider that is not served over TLS.
    insecureOptions: issuerUrl.protocol === 'http:' ? { [oauth.allowInsecureRequests]: true } : {},
    client: { client_id: clientId } satisfies oauth.Client,
  }
}

// Public client: no client secret, the PKCE code verifier protects the code exchange.
const clientAuth = oauth.None()

let _as: oauth.AuthorizationServer | undefined
const getAuthorizationServer = async (): Promise<oauth.AuthorizationServer> => {
  if (_as) {
    return _as
  }

  const { issuerUrl, insecureOptions } = getConfig()
  const response = await oauth.discoveryRequest(issuerUrl, { algorithm: 'oidc', ...insecureOptions })
  _as = await oauth.processDiscoveryResponse(issuerUrl, response)

  return _as
}

export const login = async () => {
  const { client } = getConfig()
  const as = await getAuthorizationServer()

  const redirectUri = window.location.origin
  const codeVerifier = oauth.generateRandomCodeVerifier()
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier)
  const state = oauth.generateRandomState()

  const authorizationUrl = new URL(as.authorization_endpoint!)
  authorizationUrl.searchParams.set('client_id', client.client_id)
  authorizationUrl.searchParams.set('redirect_uri', redirectUri)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', 'openid profile email')
  authorizationUrl.searchParams.set('code_challenge', codeChallenge)
  authorizationUrl.searchParams.set('code_challenge_method', 'S256')
  authorizationUrl.searchParams.set('state', state)

  // Fall back to a nonce if the authorization server cannot be assumed to support PKCE.
  let nonce: string | undefined
  if (as.code_challenge_methods_supported?.includes('S256') !== true) {
    nonce = oauth.generateRandomNonce()
    authorizationUrl.searchParams.set('nonce', nonce)
  }

  // The code verifier, state and nonce must survive the redirect to the authorization server.
  sessionStorage.setItem(webStorageKey, JSON.stringify({ codeVerifier, state, nonce, redirectUri }))

  window.location.assign(authorizationUrl.toString())
}

export const handleLoginRedirect = async (): Promise<oauth.IDToken | undefined> => {
  const currentUrl = new URL(window.location.href)
  if (!currentUrl.searchParams.has('code') && !currentUrl.searchParams.has('error')) {
    return undefined
  }

  const { client, insecureOptions } = getConfig()
  const as = await getAuthorizationServer()

  const storage = sessionStorage.getItem(webStorageKey)
  if (!storage) {
    throw new Error('No stored code verifier, state and nonce found')
  }
  sessionStorage.removeItem(webStorageKey)
  const { codeVerifier, state, nonce, redirectUri } = JSON.parse(storage)

  const params = oauth.validateAuthResponse(as, client, currentUrl, state)

  const authorizationResponse = await oauth.authorizationCodeGrantRequest(
    as,
    client,
    clientAuth,
    params,
    redirectUri,
    codeVerifier,
    insecureOptions,
  )
  const result = await oauth.processAuthorizationCodeResponse(as, client, authorizationResponse, {
    expectedNonce: nonce,
  })

  idToken = result.id_token
  // The ID token signature, issuer, audience and expiry are validated by oauth4webapi.
  const claims = oauth.getValidatedIdTokenClaims(result)
  if (!claims?.sub) {
    throw new Error('No sub claim in ID Token')
  }

  // Remove the authorization response from the URL.
  window.history.replaceState({}, document.title, redirectUri)
  return claims
}

export const logout = async () => {
  if (!idToken) {
    throw new Error('No ID Token')
  }

  const as = await getAuthorizationServer()

  const endSessionUrl = new URL(as.end_session_endpoint!)
  endSessionUrl.searchParams.set('post_logout_redirect_uri', window.location.origin)
  endSessionUrl.searchParams.set('id_token_hint', idToken)

  window.location.assign(endSessionUrl.toString())
}
