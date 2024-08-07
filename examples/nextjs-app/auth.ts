import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [{
    id: 'testid',
    name: 'TestID',
    issuer: 'https://testid.cerberauth.com',
    type: 'oidc',
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    checks: ['pkce', 'state'],
    authorization: {
      params: { scope: 'openid profile email' }
    },
  }],
  session: { strategy: 'jwt' },
  callbacks: {
    session: async ({ session }) => {
      return session
    },
  }
})
