# React SPA (Single Page App) using Authorization Code Flow with PKCE

This project demonstrates how to implement the Authorization Code Flow with PKCE for a React SPA.

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
  cd openid-connect-examples/react-spa-authorization-code-flow
  npm install
  ```

3. Configure the OpenID Connect provider:

  - Obtain the client ID and client secret from your OpenID Connect provider.
  - Register the redirect URI for your React SPA in the provider's developer console.

4. Update the configuration:

  - Create a `.env.local` file in the root directory of your project or copy `.env` file.
  - Add the necessary environment variables to the `.env.local` file. For example:

    ```plaintext
    VITE_CLIENT_ID=your-client-id
    VITE_REDIRECT_URI=http://localhost:3000/callback
    ```

    Replace `your-client-id`, and `http://localhost:5173/callback` with the actual values provided by your OpenID Connect provider.

  - Save the `.env.local` file.

5. Start the development server:

  ```bash
  npm run dev
  ```

6. Open your browser and navigate to `http://localhost:5173/`.

7. Click on the "Login" button to initiate the authorization code flow.

8. After successful authentication, you will be redirected back to the React SPA and the user information will be displayed.

## Additional Resources

- [OpenID Connect](https://openid.net/)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [PKCE](https://oauth.net/2/pkce/)
- [Awesome OpenID Connect](https://github.com/cerberauth/awesome-openid-connect)
- [React](https://reactjs.org/)
