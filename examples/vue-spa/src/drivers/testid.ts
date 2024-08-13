import { defineOAuth2Driver } from 'vue-auth3'

export default defineOAuth2Driver({
  url: 'https://testid.cerberauth.com/oauth2/auth',

  params: {
    client_id: '',
    redirect_uri: 'login/testid',
    response_type: 'code',
    scope: 'openid profile email',
    state: {},
  },
})
