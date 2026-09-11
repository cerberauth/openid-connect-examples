export default defineOAuthOidcEventHandler({
  config: {
    scope: ['openid', 'profile', 'email'],
  },
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('OIDC error:', error)
    return sendRedirect(event, '/')
  },
})
