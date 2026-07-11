# Astro App using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for an Astro App.

Disclaimer: This project is for educational purposes only and should not be used in production without proper security review and testing.

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

6. Click on the "Login with TestID" button to initiate the authorization code flow.

7. After successful authentication, you will be redirected back to the application and the user information will be displayed.

## Configuration

Configure the OpenID Connect provider:

If you don't have an OpenID Connect provider, you can create a Test Client on the [TestID OpenID Connect Provider](https://nacho.cerberauth.com/templates/nextjs-app).

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your Astro App in the provider's developer console.

Update the configuration:
- Create a `.env` file in the root directory of your project or copy the `.env.example` file.
- Add the necessary environment variables to the `.env` file. For example:

```plaintext
AUTH_SECRET=secret
AUTH_CLIENT_ID=your-client-id
AUTH_CLIENT_SECRET=your-client-secret
AUTH_REDIRECT_URI=http://localhost:4321/api/auth/callback
```

Generate a random secret using the following command:

```bash
openssl rand -base64 33
```

Replace `secret` with the generated secret.

Replace `your-client-id` and `your-client-secret` with the actual values provided by your OpenID Connect provider.

Save the `.env` file.

## Additional Resources

- [Astro](https://astro.build/)
- [Arctic](https://arctic.js.org/)
- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
