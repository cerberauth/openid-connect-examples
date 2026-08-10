export interface ConfigBaseProps {
  persistNavigation: 'always' | 'dev' | 'prod' | 'never'
  catchErrors: 'always' | 'dev' | 'prod' | 'never'
  exitRoutes: string[]
  /**
   * OpenID Connect issuer used for discovery (authorization_endpoint, token_endpoint, ...).
   */
  oidcIssuer: string
  /**
   * Client registered at the issuer above for this app's redirect URL (see oidcRedirectUrl).
   * This app ships with no client registered: create one at your IDP with a native/public
   * client type and `oidcRedirectUrl` as its redirect URI, then fill this in before logging in.
   */
  oidcClientId: string
  /**
   * Must match the app scheme declared in app.json ("scheme") and be registered as a
   * redirect URI on the OIDC client above.
   */
  oidcRedirectUrl: string
}

export type PersistNavigationConfig = ConfigBaseProps['persistNavigation']

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: 'dev',

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: 'always',

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ['Home'],

  oidcIssuer: 'https://testid.cerberauth.com',
  oidcClientId: '',
  oidcRedirectUrl: 'react-native-app://oauthredirect',
}

export default BaseConfig
