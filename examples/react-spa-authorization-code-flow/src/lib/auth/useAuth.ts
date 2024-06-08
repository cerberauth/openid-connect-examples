// This code is heavily based on the following example: https://github.com/panva/oauth4webapi/blob/HEAD/examples/oidc.ts

import { useContext, useEffect, useState } from 'react'
import * as oauth from 'oauth4webapi'
import { AuthContext } from './context'

const webStorageKey = 'oidc:auth'

type LoginParams = {
  scope?: string;
  redirectUri?: string;
}

export const useAuth = () => {
  const { setAccessToken, setIdToken, setUser, client, user, as } = useContext(AuthContext)
  const [isHandlingRedirect, setHandlingRedirect] = useState(false)

  const login = async (params?: LoginParams) => {
    if (!as) {
      console.error('Authorization Server is not available')
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
    let nonce: string | undefined

    const authorizationUrl = new URL(as.authorization_endpoint!)
    authorizationUrl.searchParams.set('client_id', client.client_id)
    authorizationUrl.searchParams.set('redirect_uri', redirectUri)
    authorizationUrl.searchParams.set('response_type', 'code')
    authorizationUrl.searchParams.set('scope', scope)
    authorizationUrl.searchParams.set('code_challenge', code_challenge)
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)

    /**
     * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use of PKCE is
     * backwards compatible even if the AS doesn't support it which is why we're using it regardless.
     */
    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
      nonce = oauth.generateRandomNonce()
      authorizationUrl.searchParams.set('nonce', nonce)
    }

    console.log('store code_verifier and nonce in the end-user session')
    sessionStorage.setItem(webStorageKey, JSON.stringify({ code_verifier, nonce, redirectUri }))

    console.log('Redirect to Authorization Server', authorizationUrl.toString())
    window.location.assign(authorizationUrl.toString())
  }

  const handleLoginRedirect = async () => {
    if (!as || !client || isHandlingRedirect) {
      console.error('Authorization Server or Client is not available')
      return
    }

    setHandlingRedirect(true)

    const storage = sessionStorage.getItem(webStorageKey)
    if (!storage) {
      console.error('No stored code_verifier and nonce found')
      return
    }
    sessionStorage.removeItem(webStorageKey)
    const { code_verifier, nonce, redirectUri } = JSON.parse(storage)

    let sub: string
    let accessToken: string

    // @ts-expect-error
    const currentUrl: URL = new URL(window.location)
    const params = oauth.validateAuthResponse(as, client, currentUrl)
    if (oauth.isOAuth2Error(params)) {
      console.error('Error Response', params)
      setHandlingRedirect(false)
      return
    }

    const authorizationResponse = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      params,
      redirectUri,
      code_verifier,
    )

    let challenges: oauth.WWWAuthenticateChallenge[] | undefined
    if ((challenges = oauth.parseWwwAuthenticateChallenges(authorizationResponse))) {
      for (const challenge of challenges) {
        console.error('WWW-Authenticate Challenge', challenge)
      }
      setHandlingRedirect(false)
      return
    }

    const authorizationCodeResult = await oauth.processAuthorizationCodeOpenIDResponse(as, client, authorizationResponse, nonce)
    if (oauth.isOAuth2Error(authorizationCodeResult)) {
      console.error('Error Response', authorizationCodeResult)
      setHandlingRedirect(false)
      return
    }

    console.log('Access Token Response', authorizationCodeResult)
    accessToken = authorizationCodeResult.access_token
    setAccessToken(accessToken)
    setIdToken(authorizationCodeResult.id_token)
    const claims = oauth.getValidatedIdTokenClaims(authorizationCodeResult)
    console.log('ID Token Claims', claims)
    sub = claims.sub

    // UserInfo Request
    const response = await oauth.userInfoRequest(as, client, accessToken)
    if (challenges = oauth.parseWwwAuthenticateChallenges(response)) {
      for (const challenge of challenges) {
        console.error('WWW-Authenticate Challenge', challenge)
      }
      setHandlingRedirect(false)
      return
    }

    const user = await oauth.processUserInfoResponse(as, client, sub, response)
    console.log('UserInfo Response', user)
    setUser(user)

    setHandlingRedirect(false)
    window.history.replaceState({}, document.title, redirectUri || window.location.origin)
  }

  const logout = () => {
    setAccessToken(undefined)
    setIdToken(undefined)
    setUser(undefined)
  }

  useEffect(() => {
    if (window.location.search.includes('code=')) {
      handleLoginRedirect()
    }
  }, [window.location.search, as, client])

  return {
    user,
    isAuthenticated: !!user,
    login,
    handleLoginRedirect,
    logout,
  }
}
