import { reactive, computed } from 'vue'
import {
  login as oidcLogin,
  handleLoginRedirect as oidcHandleLoginRedirect,
  logout as oidcLogout,
} from './oidc'

interface AuthState {
  isAuthenticated: boolean
  user: null | { [key: string]: any }
}

const state = reactive<AuthState>({
  isAuthenticated: false,
  user: null,
})

export function useAuth() {
  const login = () => {
    oidcLogin()
  }

  const handleLoginRedirect = async () => {
    const _user = await oidcHandleLoginRedirect()
    if (!_user) {
      return
    }

    state.isAuthenticated = true
    state.user = _user
  }

  const logout = () => {
    state.isAuthenticated = false
    state.user = null
    oidcLogout()
  }

  const isAuthenticated = computed(() => state.isAuthenticated)
  const user = computed(() => state.user)

  return {
    login,
    handleLoginRedirect,
    logout,
    isAuthenticated,
    user,
  }
}
