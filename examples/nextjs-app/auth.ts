import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [{
    id: 'testid',
    name: 'TestID',
    issuer: 'https://testid.cerberauth.com',
    type: 'oidc',
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    checks: ['pkce', 'state', 'nonce'],
    authorization: {
      params: { scope: 'openid profile email' }
    },
    idToken: true,
  }],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: ({ token, profile }) => {
      if (profile?.sub && profile?.email) {
        return {
          sub: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        }
      }

      return token
    },
    session: async ({ session }) => {
      return session
    },
  }
})
