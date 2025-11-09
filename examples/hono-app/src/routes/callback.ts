import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import { app } from '../app'
import { getAuthorizationServer, getClient } from '../as'
import { cleanupCookies, CookieName, cookieOptions } from '../cookies'
import { processCallback } from '../lib/oidc'

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

  const state = getCookie(c, CookieName.State)
  const nonce = getCookie(c, CookieName.Nonce)

  const { client, clientSecret, redirectUrl } = getClient(c)

  try {
    const {
      expiresIn,
      accessToken,
      idToken,
      refreshToken,
    } = await processCallback({
      as,
      client,
      clientSecret,
      redirectUrl: redirectUrl.toString(),
      url: c.req.url,
      codeVerifier,
      nonce,
      state,
    })
    if (!accessToken) {
      return c.redirect('/')
    }

    deleteCookie(c, CookieName.State)
    deleteCookie(c, CookieName.CodeVerifier)
    deleteCookie(c, CookieName.Nonce)

    cleanupCookies(c)
    setCookie(c, CookieName.AccessToken, accessToken.toString(), cookieOptions);
    if (expiresIn) {
      setCookie(c, CookieName.ExpiresIn, expiresIn.toString(), cookieOptions);
    }
    if (idToken) {
      setCookie(c, CookieName.IdToken, idToken.toString(), cookieOptions);
    }
    if (refreshToken) {
      setCookie(c, CookieName.RefreshToken, refreshToken.toString(), cookieOptions);
    }
  } catch (e) {
    console.error(e)
  }

  return c.redirect('/')
})
