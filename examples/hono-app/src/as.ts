import type { Context } from 'hono'
import { type Client, discoveryRequest, processDiscoveryResponse, type AuthorizationServer } from 'oauth4webapi'

export function getClient(c: Context) {
  const issuer = new URL(c.env.AUTH_ISSUER)
  const client: Client = {
    client_id: c.env.AUTH_CLIENT_ID,
  }
  const redirectUrl = new URL(c.env.AUTH_REDIRECT_URI)
  const postLogoutRedirectUrl = new URL(c.env.AUTH_POST_LOGOUT_REDIRECT_URI)

  return {
    issuer,
    client,
    clientSecret: c.env.AUTH_CLIENT_SECRET,
    redirectUrl,
    postLogoutRedirectUrl,
  }
}

let authorizationServer: AuthorizationServer | undefined = undefined
export async function getAuthorizationServer(c: Context): Promise<AuthorizationServer> {
  if (!authorizationServer) {
    const { issuer } = getClient(c)
    let as = await discoveryRequest(issuer, { algorithm: 'oidc' })
      .then((response) => processDiscoveryResponse(issuer, response))
    authorizationServer = as
  }

  return authorizationServer
}
