import * as oauth from 'oauth4webapi'

const webStorageKey = 'oidc:auth'
let accessToken: string | undefined
let idToken: string | undefined

if (!import.meta.env.VITE_OIDC_ISSUER) {
  throw new Error('OIDC_ISSUER is not set')
}

if (!import.meta.env.VITE_OIDC_CLIENT_ID) {
  throw new Error('OIDC_CLIENT_ID is not set')
}

const issuer = import.meta.env.VITE_OIDC_ISSUER
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID

const issuerUrl = new URL(issuer)

const client: oauth.Client = {
  client_id: clientId,
  redirect_uris: [window.location.origin],
}
const clientAuth = oauth.None()

let _as: oauth.AuthorizationServer | undefined
const getAuthorizationServer = async (): Promise<oauth.AuthorizationServer> => {
  if (_as) {
    return _as
  }

  _as = await oauth.discoveryRequest(issuerUrl, { algorithm: 'oidc' })
    .then((response) => oauth.processDiscoveryResponse(issuerUrl, response))
  if (!_as) {
    throw new Error('Invalid Authorization Server')
  }

  return _as
}

type LoginParams = {
  scope?: string;
  redirectUri?: string;
}

export const login = async (params?: LoginParams) => {
  const as = await getAuthorizationServer()

  const scope = params?.scope || 'openid email'
  let redirectUri = params?.redirectUri
  if (!redirectUri && Array.isArray(client.redirect_uris) && client.redirect_uris.length > 1) {
    redirectUri = client.redirect_uris[0]?.toString()
  }
  redirectUri = redirectUri || window.location.origin

  const code_challenge_method = 'S256'
  /**
   * The following MUST be generated for every redirect to the authorization_endpoint. You must store
   * the code_verifier and nonce in the end-user session such that it can be recovered as the user
   * gets redirected from the authorization server back to your application.
   */
  const codeVerifier = oauth.generateRandomCodeVerifier()
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier)
  let nonce: string | undefined

  const authorizationUrl = new URL(as.authorization_endpoint!)
  authorizationUrl.searchParams.set('client_id', client.client_id)
  authorizationUrl.searchParams.set('redirect_uri', redirectUri)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', scope)
  authorizationUrl.searchParams.set('code_challenge', codeChallenge)
  authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)

  let state: string | undefined
  state = oauth.generateRandomState()
  authorizationUrl.searchParams.set('state', state)

  /**
   * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use of PKCE is
   * backwards compatible even if the AS doesn't support it which is why we're using it regardless.
   */
  if (as.code_challenge_methods_supported?.includes('S256') !== true) {
    nonce = oauth.generateRandomNonce()
    authorizationUrl.searchParams.set('nonce', nonce)
  }

  console.log('store code_verifier and nonce in the end-user session')
  sessionStorage.setItem(webStorageKey, JSON.stringify({ codeVerifier, state, nonce, redirectUri }))

  console.log('Redirecting to Authorization Server', authorizationUrl.toString())
  window.location.assign(authorizationUrl.toString())
}

export const handleLoginRedirect = async (): Promise<oauth.UserInfoResponse | undefined> => {
  // @ts-expect-error
  const currentUrl: URL = new URL(window.location)
  if (!currentUrl.searchParams.has('code')) {
    return undefined
  }

  const as = await getAuthorizationServer()

  const storage = sessionStorage.getItem(webStorageKey)
  if (!storage) {
    throw new Error('No stored codeVerifier and nonce found')
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
  )

  const authorizationCodeResult = await oauth.processAuthorizationCodeResponse(as, client, authorizationResponse, { expectedNonce: nonce })

  console.log('Access Token Response', authorizationCodeResult)
  accessToken = authorizationCodeResult.access_token
  idToken = authorizationCodeResult.id_token
  const claims = oauth.getValidatedIdTokenClaims(authorizationCodeResult)
  console.log('ID Token Claims', claims)

  const sub = claims?.sub
  if (!sub) {
    throw new Error('No sub claim in ID Token')
  }

  // UserInfo Request
  const response = await oauth.userInfoRequest(as, client, accessToken)
  const user = await oauth.processUserInfoResponse(as, client, sub, response)
  console.log('UserInfo Response', user)

  window.history.replaceState({}, document.title, redirectUri || window.location.origin)
  return user
}

export const logout = async () => {
  if (!idToken) {
    throw new Error('No ID Token')
  }

  const as = await getAuthorizationServer()

  const endSessionUrl = new URL(as.end_session_endpoint!)
  endSessionUrl.searchParams.set('post_logout_redirect_uri', window.location.origin)
  endSessionUrl.searchParams.set('id_token_hint', idToken)
  console.log('Redirecting to End Session Endpoint', endSessionUrl.toString())

  window.location.assign(endSessionUrl.toString())
}
