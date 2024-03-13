import { createContext } from 'react'

export type User = {
  id: string
  email?: string
  name?: string
  picture?: string
}

export type Session = {
  id: string
}

export type AuthContextType = {
  user?: User
  session?: Session
  setUser: (user?: User) => void
  setSession: (session?: Session) => void
}

export const AuthContext = createContext<AuthContextType>({
  setUser: () => {},
  setSession: () => {},
})
