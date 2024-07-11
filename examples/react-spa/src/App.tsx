import { Router } from 'wouter'

import { AuthProvider } from './lib/auth/AuthProvider'
import { PageRouter } from './components/PageRouter'

function App() {
  return (
    <AuthProvider
      issuer={import.meta.env.VITE_OIDC_ISSUER}
      clientId={import.meta.env.VITE_OIDC_CLIENT_ID}
    >
      <Router>
        <PageRouter />
      </Router>
    </AuthProvider>
  )
}

export default App
