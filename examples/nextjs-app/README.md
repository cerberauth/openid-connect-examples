# Next.js App using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for a Next.js App.

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

## Demo

This project is deployed on [Cloudflare Pages](https://cerberauth-nextjs-app-oidc.pages.dev/) and on [Vercel](https://cerberauth-nextjs-app-oidc.vercel.app/).

## Deploy your own

Deploy the project using **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Ftree%2Fmain%2Fexamples%2Fnextjs-app&env=AUTH_SECRET,AUTH_CLIENT_ID,AUTH_CLIENT_SECRET&envDescription=Configurations%20Documentation&envLink=https%3A%2F%2Fgithub.com%2Fcerberauth%2Fopenid-connect-examples%2Fblob%2Fmain%2Fexamples%2Fnextjs-app%2FREADME.md&project-name=nextjs-app-oidc&repository-name=cerberauth-nextjs-app-oidc&demo-title=Next.js%20with%20OpenID%20Connect&demo-description=A%20Next.js%20App%20using%20OpenID%20Connect&demo-url=https%3A%2F%2Fcerberauth-nextjs-app-oidc.pages.dev%2F)

Deploy the project using **Cloudflare**:

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cerberauth/openid-connect-examples/tree/main/examples/nextjs-app)

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
  cd openid-connect-examples/nextjs-app
  npm ci
  ```

3. Configure the OpenID Connect provider (see the Configuration section below).

4. Start the development server:

  ```bash
  npm run dev
  ```

5. Open your browser and navigate to `http://localhost:5173/`.

6. Click on the "Login" button to initiate the authorization code flow.

7. After successful authentication, you will be redirected back to the application and the user information will be displayed.

## Configuration

Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can create a Test Client on the [TestID OpenID Connect Provider](https://nacho.cerberauth.com/templates/nextjs-app).

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your Next.js App in the provider's developer console.

Update the configuration:
- Create a `.env.local` file in the root directory of your project or copy `.env.example` file.
- Add the necessary environment variables to the `.env.local` file. For example:

```plaintext
AUTH_SECRET=secret
AUTH_CLIENT_ID=your-client-id
AUTH_CLIENT_SECRET=your-client-secret
```

Generate a random secret using the following command:

```bash
openssl rand -base64 33
```

Replace `secret` with the generated secret.

Replace `your-client-id` and `your-client-secret` with the actual values provided by your OpenID Connect provider.

Save the `.env.local` file.

## Additional Resources

- [Auth.js](https://authjs.dev/)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
