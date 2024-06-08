import { useContext, useEffect } from 'react'
import { AuthContext } from './context'

export const useAuth = () => {
  const { setUser, user } = useContext(AuthContext)
  const { setSession, session } = useContext(AuthContext)
  useEffect(() => {
    if (user) {
      return
    }

    fetch('/session')
      .then((response) => response.json())
      .then((data) => {
        setSession(data?.session || null)
        setUser(data?.user || null)
      })
  }, [setUser])

  const login = async () => {
    const authorizationUrl = `/oauth/authorize`

    window.location.assign(authorizationUrl.toString())
  }

  const logout = () => {
    const logoutUrl = '/oauth/logout'
    window.location.assign(logoutUrl.toString())
  }

  return {
    user,
    isAuthenticated: !!session?.id,
    login,
    logout,
  }
}
