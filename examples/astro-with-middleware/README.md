# Astro SSR using Better Auth and OpenID Connect

This project demonstrates how to implement the Authorization Code Flow with PKCE in an [Astro](https://astro.build/) application rendered on demand (SSR), using [Better Auth](https://better-auth.com/) and its [Generic OAuth plugin](https://better-auth.com/docs/plugins/generic-oauth), as described in the [Better Auth Astro integration](https://better-auth.com/docs/integrations/astro).

The authentication state is resolved on the server by an [Astro middleware](https://docs.astro.build/en/guides/middleware/) on every request. It exposes the user in `Astro.locals` and protects the `/profile` page. If you do not need a server, see the [Astro SSG example](../astro-app/README.md).

Better Auth runs without a database (stateless mode): the session and the OpenID Connect account data are stored in encrypted cookies.

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Demo

This project is deployed on [Cloudflare Workers](https://astro-with-middleware-oidc.cerberauth.workers.dev/) and on [Vercel](https://cerberauth-astro-with-middleware-oidc.vercel.app/).

## Deploy your own

The adapter is selected at build time in `astro.config.mjs`: Node.js by default (used by the `Dockerfile`), Vercel when the `VERCEL` variable is set, and Cloudflare when `ASTRO_ADAPTER=cloudflare`.

Deploy the project using **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Ftree%2Fmain%2Fexamples%2Fastro-with-middleware&env=BETTER_AUTH_SECRET,BETTER_AUTH_URL,AUTH_ISSUER,AUTH_CLIENT_ID,AUTH_CLIENT_SECRET&envDescription=Configurations%20Documentation&envLink=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Fblob%2Fmain%2Fexamples%2Fastro-with-middleware%2FREADME.md&project-name=astro-with-middleware-oidc&repository-name=cerberauth-astro-with-middleware-oidc&demo-title=Astro%20SSR%20with%20OpenID%20Connect&demo-description=An%20Astro%20SSR%20application%20using%20Better%20Auth%20and%20OpenID%20Connect&demo-url=https%3A%2F%2Fcerberauth-astro-with-middleware-oidc.vercel.app%2F)

Deploy the project using **Cloudflare**:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cerberauth/openid-connect-examples/tree/main/examples/astro-with-middleware)

When deploying to Cloudflare, build with `ASTRO_ADAPTER=cloudflare npm run build`, set `BETTER_AUTH_URL` and `AUTH_ISSUER` in `wrangler.jsonc`, and set `BETTER_AUTH_SECRET`, `AUTH_CLIENT_ID` and `AUTH_CLIENT_SECRET` as Worker secrets.

## Prerequisites

Before getting started, make sure you have the following:

- Node.js installed on your machine
- An OpenID Connect provider that supports the Authorization Code Flow with PKCE

## Getting Started

1. Clone the repository:

  ```bash
  git clone https://github.com/cerberauth/openid-connect-examples.git
  ```

2. Install the dependencies:

  ```bash
  cd openid-connect-examples/examples/astro-with-middleware
  npm ci
  ```

3. Configure the OpenID Connect provider (see the Configuration section below).

4. Start the development server:

  ```bash
  npm run dev
  ```

5. Open your browser and navigate to `http://localhost:4321/`.

6. Click on the "Login with StubIdP" button to initiate the authorization code flow.

7. After successful authentication, you will be redirected back to the application. The `/profile` page is only available when signed in.

## Configuration

Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can use [stubIdP](https://stubidp.cerberauth.com/).

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your application in the provider's developer console. The redirect URI is `http://localhost:4321/api/auth/callback/stubidp`.
  - Register the post logout redirect URI `http://localhost:4321/` (with the trailing slash, Better Auth normalizes the URL).

Update the configuration:
- Create a `.env` file in the root directory of your project or copy the `.env.example` file.
- Add the necessary environment variables to the `.env` file. For example:

```plaintext
BETTER_AUTH_SECRET=secret
BETTER_AUTH_URL=http://localhost:4321
AUTH_ISSUER=https://your-provider
AUTH_CLIENT_ID=your-client-id
AUTH_CLIENT_SECRET=your-client-secret
```

Generate a random secret using the following command:

```bash
openssl rand -base64 33
```

Replace `secret` with the generated secret (minimum 32 characters).

Replace `your-client-id` and `your-client-secret` with the actual values provided by your OpenID Connect provider.

The variables are declared in the `env.schema` of `astro.config.mjs` and read at runtime with `getSecret()`, so the same code works on Node.js, Cloudflare Workers and Vercel.

## How it works

- `src/lib/auth.ts` creates the Better Auth instance with the Generic OAuth plugin, configured with the provider discovery URL. PKCE is enabled.
- `src/pages/api/auth/[...all].ts` mounts the Better Auth handler. The authorization callback is served at `/api/auth/callback/stubidp`.
- `src/middleware.ts` reads the session on every request, sets `Astro.locals.user` and `Astro.locals.session`, and redirects anonymous visitors away from `/profile`.
- `src/lib/auth-client.ts` is the browser client used by the login and logout buttons of `src/pages/index.astro`. Logging out also ends the session at the OpenID Connect provider (RP-initiated logout) when it exposes an `end_session_endpoint`.

## Additional Resources

- [Better Auth](https://better-auth.com/)
- [Better Auth Astro integration](https://better-auth.com/docs/integrations/astro)
- [Better Auth Generic OAuth plugin](https://better-auth.com/docs/plugins/generic-oauth)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
- [Astro](https://astro.build/)
