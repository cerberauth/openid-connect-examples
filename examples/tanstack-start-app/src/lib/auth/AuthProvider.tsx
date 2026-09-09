import { useState, useEffect } from 'react'
import { allowInsecureRequests, type Client, discoveryRequest, processDiscoveryResponse } from 'oauth4webapi'
import { AuthContext, type AuthContextType } from './context'

type AuthProviderProps = {
  issuer: string
  clientId: string
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, issuer, clientId }) => {
  // Lazily read window.location so this also renders safely during the
  // server-side prerender of the SPA shell (see `spa.enabled` in vite.config.ts).
  const [client] = useState<Client>(() => ({
    client_id: clientId,
    token_endpoint_auth_method: 'none',
    redirect_uris: typeof window !== 'undefined' ? [window.location.origin] : [],
  }))

  const [as, setAs] = useState<AuthContextType['as']>()
  const [accessToken, setAccessToken] = useState<AuthContextType['accessToken']>()
  const [idToken, setIdToken] = useState<AuthContextType['idToken']>()
  const [user, setUser] = useState<AuthContextType['user']>()

  useEffect(() => {
    if (!issuer || as) {
      return
    }

    try {
      const issuerUrl = new URL(issuer)
      const insecureOpts = issuerUrl.protocol === 'http:' ? { [allowInsecureRequests]: true } : {}
      discoveryRequest(issuerUrl, { algorithm: 'oidc', ...insecureOpts })
        .then((response) => processDiscoveryResponse(issuerUrl, response))
        .then((as) => setAs(as))
        .catch((error) => console.error('Failed to fetch issuer metadata', error))
    } catch (error) {
      console.error('Failed to fetch issuer metadata', error)
    }
  }, [issuer])

  return (
    <AuthContext.Provider value={{
      as,
      client,
      accessToken,
      setAccessToken,
      idToken,
      setIdToken,
      user,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
