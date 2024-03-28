import { useState, useEffect } from 'react'
import { AuthContext, type AuthContextType } from './context'

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>()

  useEffect(() => {

  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
