export const environment = {
  production: false,
  auth: {
    issuer: 'http://localhost:8481',
    redirectUri: window.location.origin + '/index.html',
    clientId: 'e2e-test-client',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,
    timeoutFactor: 0.01,
    requireHttps: false,
  },
};
