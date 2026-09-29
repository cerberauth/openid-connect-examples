# Nuxt App using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for a Nuxt Application using [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils).

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Demo

This project is deployed on [Cloudflare Workers](https://nuxt-app-oidc.cerberauth.workers.dev/) and on [Vercel](https://cerberauth-nuxt-app-oidc.vercel.app/).

## Deploy your own

Deploy the project using **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Ftree%2Fmain%2Fexamples%2Fnuxt-app&env=NUXT_SESSION_PASSWORD,NUXT_OAUTH_OIDC_CLIENT_ID,NUXT_OAUTH_OIDC_CLIENT_SECRET&envDescription=Configurations%20Documentation&envLink=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Fblob%2Fmain%2Fexamples%2Fnuxt-app%2FREADME.md&project-name=nuxt-app-oidc&repository-name=cerberauth-nuxt-app-oidc&demo-title=Nuxt%20with%20OpenID%20Connect&demo-description=A%20Nuxt%20Application%20using%20OpenID%20Connect&demo-url=https%3A%2F%2Fcerberauth-nuxt-app-oidc.vercel.app%2F)

Deploy the project using **Cloudflare**:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cerberauth/openid-connect-examples/tree/main/examples/nuxt-app)

When deploying to Cloudflare, build with the `cloudflare_module` Nitro preset (`NITRO_PRESET=cloudflare_module npm run build`) and set `NUXT_SESSION_PASSWORD`, `NUXT_OAUTH_OIDC_CLIENT_ID` and `NUXT_OAUTH_OIDC_CLIENT_SECRET` as Worker secrets.

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
  cd openid-connect-examples/examples/nuxt-app
  npm ci
  ```

3. Configure the OpenID Connect provider (see the Configuration section below).

4. Start the development server:

  ```bash
  npm run dev
  ```

5. Open your browser and navigate to `http://localhost:3000/`.

6. Click on the "Login with StubIdP" button to initiate the authorization code flow.

7. After successful authentication, you will be redirected back to the application.

## Configuration

Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can use [stubIdP](https://stubidp.cerberauth.com/).

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your Nuxt Application in the provider's developer console. The redirect URI is `http://localhost:3000/auth/oidc`.

Update the configuration:
- Create a `.env` file in the root directory of your project or copy the `.env.example` file.
- Add the necessary environment variables to the `.env` file. For example:

```plaintext
NUXT_SESSION_PASSWORD=secret
NUXT_OAUTH_OIDC_CLIENT_ID=your-client-id
NUXT_OAUTH_OIDC_CLIENT_SECRET=your-client-secret
NUXT_OAUTH_OIDC_OPENID_CONFIG=https://your-provider/.well-known/openid-configuration
```

Generate a random session password using the following command:

```bash
openssl rand -base64 33
```

Replace `secret` with the generated password (minimum 32 characters).

Replace `your-client-id` and `your-client-secret` with the actual values provided by your OpenID Connect provider.

Save the `.env` file.

## Additional Resources

- [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
- [Nuxt](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
