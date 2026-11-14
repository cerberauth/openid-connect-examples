# Astro Static Site (SSG) using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE in a statically generated [Astro](https://astro.build/) site, using [oauth4webapi](https://github.com/panva/oauth4webapi).

The site is pure SSG: `astro build` outputs plain HTML, CSS and JavaScript files that can be served by any static host, and there is no server code. The OpenID Connect flow runs entirely in the browser, as a public client (no client secret). If you need a server to hold the session, see the [Astro SSR example](../astro-with-middleware/README.md).

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Demo

This project is deployed on [Cloudflare Workers](https://astro-app-oidc.cerberauth.workers.dev/) and on [Vercel](https://cerberauth-astro-app-oidc.vercel.app/).

## Deploy your own

Deploy the project using **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Ftree%2Fmain%2Fexamples%2Fastro-app&env=VITE_OIDC_CLIENT_ID&envDescription=Configurations%20Documentation&envLink=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Fblob%2Fmain%2Fexamples%2Fastro-app%2FREADME.md&project-name=astro-app-oidc&repository-name=cerberauth-astro-app-oidc&demo-title=Astro%20SSG%20with%20OpenID%20Connect&demo-description=A%20static%20Astro%20site%20using%20OpenID%20Connect%20Authorization%20Code%20Flow%20with%20PKCE&demo-url=https%3A%2F%2Fcerberauth-astro-app-oidc.vercel.app%2F)

Deploy the project using **Cloudflare**:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cerberauth/openid-connect-examples/tree/main/examples/astro-app)

The client ID is read at build time, set `VITE_OIDC_CLIENT_ID` (and `VITE_OIDC_ISSUER` if you do not use stubIdP) in the build environment.

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
  cd openid-connect-examples/examples/astro-app
  npm ci
  ```

3. Configure the OpenID Connect provider (see the Configuration section below).

4. Start the development server:

  ```bash
  npm run dev
  ```

5. Open your browser and navigate to `http://localhost:4321/`.

6. Click on the "Login with StubIdP" button to initiate the authorization code flow.

7. After successful authentication, you will be redirected back to the site and the user is displayed.

## Configuration

Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can use [stubIdP](https://stubidp.cerberauth.com/).

  - Register a public client (no client secret) in your OpenID Connect provider.
  - Register the redirect URI and the post logout redirect URI for your site in the provider's developer console. Both are the origin of the site, for example `http://localhost:4321`.

Update the configuration:
- Create a `.env.local` file in the root directory of your project (it takes precedence over `.env`).
- Add the necessary environment variables to the `.env.local` file. For example:

```plaintext
VITE_OIDC_ISSUER=https://your-provider
VITE_OIDC_CLIENT_ID=your-client-id
```

Replace `your-client-id` with the actual value provided by your OpenID Connect provider.

Astro only exposes `PUBLIC_*` variables to the browser by default. The `VITE_*` prefix is added in `astro.config.mjs` to stay consistent with the other SPA examples. As these values end up in the JavaScript bundle, never put a secret in them.

## How it works

The page is generated at build time and has no knowledge of the user. The script in `src/pages/index.astro` runs in the browser and relies on `src/lib/oidc.ts`:

1. `login()` discovers the provider, generates the PKCE code verifier and the state, keeps them in `sessionStorage` and redirects to the authorization endpoint.
2. When the provider redirects back with a `code`, `handleLoginRedirect()` validates the response, exchanges the code with the code verifier and validates the ID token.
3. `logout()` redirects to the end session endpoint of the provider with the ID token as a hint.

The tokens are only kept in memory, so reloading the page signs the user out of the site.

## Additional Resources

- [oauth4webapi](https://github.com/panva/oauth4webapi)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
- [Astro](https://astro.build/)
