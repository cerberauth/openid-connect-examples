import { Router } from 'wouter'

import { AuthProvider } from './lib/auth/AuthProvider'
import { Header } from './components/Header'
import { PageRouter } from './components/PageRouter'

function App() {
  return (
    <AuthProvider
      issuer={import.meta.env.VITE_OIDC_ISSUER}
      clientId={import.meta.env.VITE_OIDC_CLIENT_ID}
    >
      <Router>
        <main role="main" className="wrapper">
          <div className="content">
            <Header />

            <PageRouter />
          </div>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App
