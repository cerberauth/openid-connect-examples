# Hono using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for an Hono application.

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Deployment

This project is deployed on Cloudflare Pages. You can access the live demo [here](https://hono-app-oidc.cerberauth.workers.dev/).

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
  cd openid-connect-examples/hono-app
  npm ci
  ```

3. Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can use [TestID OpenID Connect Provider](https://testid.cerberauth.com/).

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your Hono server in the provider's developer console.

4. Update the configuration:

  - Create a `.env` file in the root directory of your project or copy `.env.example` file.
  - Add the necessary environment variables to the `.env` file. For example:

    ```plaintext
    AUTH_ISSUER="https://testid.cerberauth.com"
    AUTH_CLIENT_ID=your-client-id
    AUTH_CLIENT_SECRET=your-client-secret
    AUTH_REDIRECT_URI=http://localhost:5173/auth/callback
    AUTH_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
    ```

    Replace `your-client-id`, `your-client-secret`, and `http://localhost:5173/auth/callback` with the actual values provided by your OpenID Connect provider.
  - Save the `.env` file.

5. Start the development server:
  ```bash
  npm run dev
  ```

6. Open your browser and navigate to `http://localhost:5173/`.

7. Click on the "Login" button to initiate the authorization code flow.

8. After successful authentication, you will be redirected back to the Hono application and the user information will be displayed.

## Additional Resources

- [Hono](https://hono.dev/)
- [oauth4webapi](https://github.com/panva/oauth4webapi)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
