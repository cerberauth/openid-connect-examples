import { betterAuth } from 'better-auth'
import { genericOAuth } from 'better-auth/plugins'
import { getSecret } from 'astro:env/server'

const createAuth = () => {
  const issuer = getSecret('AUTH_ISSUER')!.replace(/\/$/, '')

  return betterAuth({
    secret: getSecret('BETTER_AUTH_SECRET'),
    baseURL: getSecret('BETTER_AUTH_URL'),
    // No `database` option: Better Auth runs in stateless mode and keeps the
    // session and the OpenID Connect account data in encrypted cookies.
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: 'stubidp',
            discoveryUrl: `${issuer}/.well-known/openid-configuration`,
            clientId: getSecret('AUTH_CLIENT_ID')!,
            clientSecret: getSecret('AUTH_CLIENT_SECRET'),
            scopes: ['openid', 'profile', 'email'],
            pkce: true,
          },
        ],
      }),
    ],
  })
}

type Auth = ReturnType<typeof createAuth>

let auth: Auth | undefined

// Secrets are only available while handling a request on some runtimes
// (e.g. Cloudflare Workers), so the instance is created lazily.
export const getAuth = (): Auth => (auth ??= createAuth())
