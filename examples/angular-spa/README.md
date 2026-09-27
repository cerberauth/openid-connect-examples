# Angular SPA (Single Page App) using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for an Angular SPA.

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Deployment

This project is deployed on [Cloudflare Pages](https://cerberauth-angular-spa-oidc.pages.dev/) and on [Vercel](https://cerberauth-angular-spa-oidc.vercel.app/).

## Deploy your own

Deploy the project using **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Ftree%2Fmain%2Fexamples%2Fangular-spa&env=VITE_OIDC_CLIENT_ID&envDescription=Configurations%20Documentation&envLink=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Fblob%2Fmain%2Fexamples%2Fangular-spa%2FREADME.md&project-name=cerberauth-angular-spa-oidc&repository-name=cerberauth-angular-spa-oidc&demo-title=Angular%20SPA%20with%20OpenID%20Connect&demo-description=An%20Angular%20SPA%20using%20OpenID%20Connect%20Authorization%20Code%20Flow%20with%20PKCE&demo-url=https%3A%2F%2Fcerberauth-angular-spa-oidc.pages.dev%2F)

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

If you don't have an OpenID Connect provider, you can use [stubIdP](https://stubidp.cerberauth.com/).

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
      issuer: 'https://stubidp.cerberauth.com',
      scopes: 'openid profile email',
    };
    ```

    Replace `your-client-id`, `http://localhost:4200/callback`, and `https://stubidp.cerberauth.com` with the actual values provided by your OpenID Connect provider.

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
