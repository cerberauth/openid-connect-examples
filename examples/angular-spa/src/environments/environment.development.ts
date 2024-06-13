export const environment = {
  production: false,
  auth: {
    issuer: 'https://testid.cerberauth.com',
    redirectUri: window.location.origin + '/index.html',
    clientId: '',
    responseType: 'code',
    scope: 'openid profile email',

    silentRefreshRedirectUri: `${window.location.origin}/silent-refresh.html`,
    useSilentRefresh: true,

    showDebugInformation: true,
    timeoutFactor: 0.01,
  },
};
