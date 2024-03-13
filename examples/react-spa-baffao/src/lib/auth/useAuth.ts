import { useContext } from 'react'
import { AuthContext } from './context'

type LoginParams = {
  scope?: string
  redirectUri?: string
}

export const useAuth = () => {
  const { setUser, user } = useContext(AuthContext)

  const login = async (params?: LoginParams) => {
    const scope = params?.scope || 'openid profile email'
    const redirectUri = params?.redirectUri || window.location.origin

    console.log(scope, redirectUri)

    setUser(user)
  }

  const logout = () => {
    setUser(undefined)
  }

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
