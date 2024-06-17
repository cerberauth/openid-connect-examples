import { useState, useEffect } from 'react'
import { Client, discoveryRequest, processDiscoveryResponse } from 'oauth4webapi'
import { AuthContext, type AuthContextType } from './context'

type AuthProviderProps = {
  issuer: string
  clientId: string
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, issuer, clientId }) => {
  const client: Client = {
    client_id: clientId,
    token_endpoint_auth_method: 'none',
    redirect_uris: [window.location.origin],
  }

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
      discoveryRequest(issuerUrl, { algorithm: 'oidc' })
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
