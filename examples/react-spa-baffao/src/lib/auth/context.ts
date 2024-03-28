import { createContext } from 'react'

export type User = {
  id: string
  email?: string
  name?: string
  picture?: string
}

export type AuthContextType = {
  user?: User
  setUser: (user?: User) => void
}

export const AuthContext = createContext<AuthContextType>({
  setUser: () => {},
})
