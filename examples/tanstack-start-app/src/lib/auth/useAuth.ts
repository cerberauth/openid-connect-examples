// This code is heavily based on the following example: https://github.com/panva/oauth4webapi/blob/HEAD/examples/oidc.ts

import { useContext, useEffect, useState } from 'react'
import * as oauth from 'oauth4webapi'
import { AuthContext } from './context'

const webStorageKey = 'oidc:auth'

type LoginParams = {
  scope?: string
  redirectUri?: string
}

export const useAuth = () => {
  const { setAccessToken, idToken, setIdToken, setUser, client, user, as } = useContext(AuthContext)
  const [isHandlingRedirect, setHandlingRedirect] = useState(false)

  const login = async (params?: LoginParams) => {
    if (!as) {
      return
    }

    if (!client) {
      throw new Error('Client is not available')
    }

    const scope = params?.scope || 'openid profile email'
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
    const code_verifier = oauth.generateRandomCodeVerifier()
    const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
    let state: string | undefined
    let nonce: string | undefined

    const authorizationUrl = new URL(as.authorization_endpoint!)
    authorizationUrl.searchParams.set('client_id', client.client_id)
    authorizationUrl.searchParams.set('redirect_uri', redirectUri)
    authorizationUrl.searchParams.set('response_type', 'code')
    authorizationUrl.searchParams.set('scope', scope)
    authorizationUrl.searchParams.set('code_challenge', code_challenge)
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)

    state = oauth.generateRandomState()
    authorizationUrl.searchParams.set('state', state)

    nonce = oauth.generateRandomNonce()
    authorizationUrl.searchParams.set('nonce', nonce)

    console.log('store code_verifier and nonce in the end-user session')
    sessionStorage.setItem(webStorageKey, JSON.stringify({ code_verifier, state, nonce, redirectUri }))

    console.log('Redirect to Authorization Server', authorizationUrl.toString())
    window.location.assign(authorizationUrl.toString())
  }

  const handleLoginRedirect = async () => {
    if (!as || !client || isHandlingRedirect) {
      return
    }

    setHandlingRedirect(true)

    const storage = sessionStorage.getItem(webStorageKey)
    if (!storage) {
      console.error('No stored code_verifier and nonce found')
      return
    }
    sessionStorage.removeItem(webStorageKey)
    const { code_verifier, state, nonce, redirectUri } = JSON.parse(storage)

    let sub: string
    let accessToken: string

    const currentUrl: URL = new URL(window.location.href)
    const params = oauth.validateAuthResponse(as, client, currentUrl, state)

    const insecureOpts = new URL(as.issuer).protocol === 'http:' ? { [oauth.allowInsecureRequests]: true } : {}

    const authorizationResponse = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      oauth.None(),
      params,
      redirectUri,
      code_verifier,
      insecureOpts,
    )

    const authorizationCodeResult = await oauth.processAuthorizationCodeResponse(as, client, authorizationResponse, {
      expectedNonce: nonce,
      requireIdToken: true,
    })

    console.log('Access Token Response', authorizationCodeResult)
    accessToken = authorizationCodeResult.access_token
    setAccessToken(accessToken)
    setIdToken(authorizationCodeResult.id_token)
    const claims = oauth.getValidatedIdTokenClaims(authorizationCodeResult)
    console.log('ID Token Claims', claims)
    sub = claims.sub

    const response = await oauth.userInfoRequest(as, client, accessToken, insecureOpts)
    const user = await oauth.processUserInfoResponse(as, client, sub, response)
    console.log('UserInfo Response', user)
    setUser(user)

    setHandlingRedirect(false)
    window.history.replaceState({}, document.title, redirectUri || window.location.origin)
  }

  const logout = () => {
    if (!as || !idToken) {
      return
    }

    const endSessionUrl = new URL(as.end_session_endpoint!)
    endSessionUrl.searchParams.set('post_logout_redirect_uri', window.location.origin)
    endSessionUrl.searchParams.set('id_token_hint', idToken)
    console.log('Redirect to End Session Endpoint', endSessionUrl.toString())

    setAccessToken(undefined)
    setIdToken(undefined)
    setUser(undefined)

    window.location.assign(endSessionUrl.toString())
  }

  // `window` is read lazily (rather than in the effect's dependency array) so
  // this hook also renders safely during the server-side prerender of the SPA shell.
  const locationSearch = typeof window !== 'undefined' ? window.location.search : ''

  useEffect(() => {
    if (locationSearch.includes('code=')) {
      handleLoginRedirect()
    }
  }, [locationSearch, as, client])

  return {
    user,
    isAuthenticated: !!user,
    login,
    handleLoginRedirect,
    logout,
  }
}
