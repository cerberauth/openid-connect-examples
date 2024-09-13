import { getCookie, setCookie } from 'hono/cookie'

import { app } from '../app'
import { getAuthorizationServer, getClient } from '../as'
import { cleanupCookies, CookieName } from '../cookies'
import { logout } from '../lib/oidc'

app.get('/auth/logout', async (c) => {
  const as = await getAuthorizationServer(c)
  const { client, postLogoutRedirectUrl } = getClient(c)

  const idToken = getCookie(c, CookieName.IdToken)
  if (!idToken) {
    return c.redirect('/')
  }

  cleanupCookies(c)

  const endSessionUrl = await logout({ as, client, redirectUrl: postLogoutRedirectUrl.toString(), idToken })

  return c.redirect(endSessionUrl.toString())
})
