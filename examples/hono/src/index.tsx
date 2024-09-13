import { Hono, type Context as HonoContext } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import type { CookieOptions } from 'hono/utils/cookie'
import { authorizationCodeGrantRequest, discoveryRequest, isOAuth2Error, parseWwwAuthenticateChallenges, processAuthorizationCodeOpenIDResponse, processDiscoveryResponse, validateAuthResponse, WWWAuthenticateChallenge, type AuthorizationServer, type Client } from 'oauth4webapi'

import { HomePage } from './pages/home'
import { getUser, login, logout } from './lib/oidc'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// app.get('/public/*', async (ctx) => {
//   return await ctx.env.ASSETS.fetch(ctx.req.raw);
// })

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'Lax',
  secure: true,
}

enum CookieName {
  CodeVerifier = 'code_verifier',
  Nonce = 'nonce',
  ExpiresIn = 'expires_in',
  AccessToken = 'access_token',
  IdToken = 'id_token',
  RefreshToken = 'refresh_token',
}

function getClient(c: HonoContext) {
  const issuer = new URL(`https://testid.cerberauth.com`)
  const client: Client = {
    client_id: c.env.AUTH_CLIENT_ID,
    client_secret: c.env.AUTH_CLIENT_SECRET,
    token_endpoint_auth_method: 'client_secret_basic',
  }
  const redirectUrl = new URL(c.env.AUTH_REDIRECT_URI)
  const postLogoutRedirectUrl = new URL(c.env.AUTH_POST_LOGOUT_REDIRECT_URI)

  return {
    issuer,
    client,
    redirectUrl,
    postLogoutRedirectUrl,
  }
}

let authorizationServer: AuthorizationServer | undefined = undefined
async function getAuthorizationServer(c: HonoContext): Promise<AuthorizationServer> {
  if (!authorizationServer) {
    const { issuer } = getClient(c)
    let as = await discoveryRequest(issuer, { algorithm: 'oidc' })
      .then((response) => processDiscoveryResponse(issuer, response))
    authorizationServer = as
  }

  return authorizationServer
}

function cleanupCookies(c: HonoContext) {
  deleteCookie(c, CookieName.ExpiresIn)
  deleteCookie(c, CookieName.AccessToken)
  deleteCookie(c, CookieName.IdToken)
  deleteCookie(c, CookieName.RefreshToken)
}

app.use(logger())
app.use(secureHeaders())

app.get('/', (c) => {
  const user = getUser({ idToken: getCookie(c, CookieName.IdToken)! })
  return c.html(<HomePage user={user} />)
})

app.get('/auth/login', async (c) => {
  const as = await getAuthorizationServer(c)
  const { client, redirectUrl } = getClient(c)
  cleanupCookies(c)

  const { codeVerifier, nonce, authorizationUrl } = await login({ as, client, redirectUrl: redirectUrl.toString() })
  setCookie(c, CookieName.CodeVerifier, codeVerifier, cookieOptions)
  if (nonce) {
    setCookie(c, CookieName.Nonce, nonce, cookieOptions)
  }

  return c.redirect(authorizationUrl.toString())
})

app.get('/auth/callback', async (c) => {
  if (getCookie(c, CookieName.AccessToken)) {
    return c.redirect('/')
  }

  const as = await getAuthorizationServer(c)

  const codeVerifier = getCookie(c, CookieName.CodeVerifier)
  if (!codeVerifier) {
    console.error('Missing code_verifier cookie')
    throw new Error()
  }

  const nonce = getCookie(c, CookieName.Nonce)

  const { client, redirectUrl } = getClient(c)
  const params = validateAuthResponse(as, client, new URL(c.req.url))
  if (isOAuth2Error(params)) {
    console.error('Error Response', params)
    throw new Error()
  }

  const response = await authorizationCodeGrantRequest(
    as,
    client,
    params,
    redirectUrl.toString(),
    codeVerifier,
  )

  let challenges: WWWAuthenticateChallenge[] | undefined
  if ((challenges = parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.error('WWW-Authenticate Challenge', challenge)
    }
    throw new Error()
  }

  const result = await processAuthorizationCodeOpenIDResponse(as, client, response, nonce)
  if (isOAuth2Error(result)) {
    console.error('Error Response', result)
    throw new Error()
  }

  deleteCookie(c, CookieName.CodeVerifier)
  deleteCookie(c, CookieName.Nonce)

  cleanupCookies(c)
  setCookie(c, CookieName.AccessToken, result.access_token, cookieOptions);
  if (result.expires_in) {
    setCookie(c, CookieName.ExpiresIn, result.expires_in.toString(), cookieOptions);
  }
  if (result.id_token) {
    setCookie(c, CookieName.IdToken, result.id_token, cookieOptions);
  }
  if (result.refresh_token) {
    setCookie(c, CookieName.RefreshToken, result.refresh_token, cookieOptions);
  }

  return c.redirect('/')
})

app.get('/auth/logout', async (c) => {
  if (!getCookie(c, CookieName.AccessToken)) {
    return c.redirect('/')
  }

  const as = await getAuthorizationServer(c)
  if (!as.end_session_endpoint) {
    cleanupCookies(c)
    return c.redirect('/')
  }

  const idToken = getCookie(c, CookieName.IdToken)
  if (!idToken) {
    cleanupCookies(c)
    return c.redirect('/')
  }

  const { client, postLogoutRedirectUrl } = getClient(c)
  const logoutUrl = await logout({ as, client, redirectUrl: postLogoutRedirectUrl.toString(), idToken })

  return c.redirect(logoutUrl.toString())
})

export default app
