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
        <main role="main" className="flex-1">
          <PageRouter />
        </main>

        <footer className="p-4">
          <div className="container mx-auto">
            <p className="text-center">Made with Love for the <a href="https://www.cerberauth.com/">CerberAuth Project</a></p>
          </div>
        </footer>
      </Router>
    </AuthProvider>
  )
}

export default App
