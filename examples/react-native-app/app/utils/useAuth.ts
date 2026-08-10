import { useCallback, useState } from 'react'
import { authorize, logout as endSession, type AuthorizeResult } from 'react-native-app-auth'

import Config from '@/config'
import { load, remove, save } from '@/utils/storage'

const AUTH_STORAGE_KEY = 'oidc.auth'

const oidcConfig = {
  issuer: Config.oidcIssuer,
  clientId: Config.oidcClientId,
  redirectUrl: Config.oidcRedirectUrl,
  scopes: ['openid', 'profile', 'email'],
  usePKCE: true,
}

type StoredAuth = Pick<AuthorizeResult, 'accessToken' | 'idToken' | 'refreshToken'>

export const useAuth = () => {
  const [auth, setAuth] = useState<StoredAuth | null>(() => load<StoredAuth>(AUTH_STORAGE_KEY))

  const login = useCallback(async () => {
    if (!Config.oidcClientId) {
      console.error(
        'No OIDC client configured. Set oidcClientId in app/config/config.base.ts (see comment above it).',
      )
      return
    }

    try {
      const result = await authorize(oidcConfig)
      const stored: StoredAuth = {
        accessToken: result.accessToken,
        idToken: result.idToken,
        refreshToken: result.refreshToken,
      }
      save(AUTH_STORAGE_KEY, stored)
      setAuth(stored)
    } catch (error) {
      console.error('Failed to authenticate', error)
    }
  }, [])

  const logout = useCallback(async () => {
    if (!auth) {
      return
    }

    try {
      await endSession(oidcConfig, {
        idToken: auth.idToken,
        postLogoutRedirectUrl: Config.oidcRedirectUrl,
      })
    } catch (error) {
      console.error('Failed to end session', error)
    } finally {
      remove(AUTH_STORAGE_KEY)
      setAuth(null)
    }
  }, [auth])

  return {
    accessToken: auth?.accessToken,
    idToken: auth?.idToken,
    isAuthenticated: !!auth?.accessToken,
    login,
    logout,
  }
}
