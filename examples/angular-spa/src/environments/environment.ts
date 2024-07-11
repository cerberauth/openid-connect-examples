export const environment = {
  production: true,
  auth: {
    issuer: 'https://testid.cerberauth.com',
    redirectUri: window.location.origin + '/index.html',
    clientId: '8f39ed37-ca04-464b-9d65-8aece2e46518',
    responseType: 'code',
    scope: 'openid profile email',

    silentRefreshRedirectUri: `${window.location.origin}/silent-refresh.html`,
    useSilentRefresh: true,

    showDebugInformation: true,
    timeoutFactor: 0.01,
  },
};
