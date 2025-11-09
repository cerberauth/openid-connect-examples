import { setCookie } from 'hono/cookie'

import { app } from '../app'
import { getAuthorizationServer, getClient } from '../as'
import { cleanupCookies, CookieName, cookieOptions } from '../cookies'
import { login } from '../lib/oidc'

app.get('/auth/login', async (c) => {
  const as = await getAuthorizationServer(c)
  const { client, redirectUrl } = getClient(c)
  cleanupCookies(c)

  const { codeVerifier, nonce, state, authorizationUrl } = await login({ as, client, redirectUrl: redirectUrl.toString() })
  setCookie(c, CookieName.CodeVerifier, codeVerifier, cookieOptions)
  if (nonce) {
    setCookie(c, CookieName.Nonce, nonce, cookieOptions)
  }
  if (state) {
    setCookie(c, CookieName.State, state, cookieOptions)
  }

  return c.redirect(authorizationUrl.toString())
})
