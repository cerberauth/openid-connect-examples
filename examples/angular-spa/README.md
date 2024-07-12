# Angular SPA (Single Page App) using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for an Angular SPA.

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Deployment

This project is deployed on Cloudflare Pages. You can access the live demo [here](https://cerberauth-angular-spa-oidc.pages.dev/).

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
  cd openid-connect-examples/angular-spa
  npm ci
  ```

3. Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can use [TestID OpenID Connect Provider](https://testid.cerberauth.com/).

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your React SPA in the provider's developer console.

4. Update the configuration:

  - Update the `environment.ts` file in the `src/environments` directory.
  - Add the necessary environment variables to the `environment.ts` file. For example:

    ```typescript
    export const environment = {
      production: false,
      clientId: 'your-client-id',
      redirectUri: 'http://localhost:4200/callback',
      issuer: 'https://testid.cerberauth.com',
      scopes: 'openid profile email',
    };
    ```

    Replace `your-client-id`, `http://localhost:4200/callback`, and `https://testid.cerberauth.com` with the actual values provided by your OpenID Connect provider.

5. Start the development server:

  ```bash
  npm start
  ```

6. Open your browser and navigate to `http://localhost:4200/`.

7. Click on the "Login" button to initiate the authorization code flow.

8. After successful authentication, you will be redirected back to the React SPA and the user information will be displayed.

## Additional Resources

- [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
- [Angular](https://angular.io/)
