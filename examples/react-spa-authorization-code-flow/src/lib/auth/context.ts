import { createContext } from 'react'
import type { Client, UserInfoResponse, AuthorizationServer } from 'oauth4webapi'

export type AuthContextType = {
  accessToken?: string
  setAccessToken: (accessToken?: string) => void
  idToken?: string
  setIdToken: (idToken?: string) => void
  user?: UserInfoResponse
  setUser: (user?: UserInfoResponse) => void
  client?: Client;
  as?: AuthorizationServer;
}

export const AuthContext = createContext<AuthContextType>({
  setAccessToken: () => { },
  setIdToken: () => { },
  setUser: () => { },
})
