import { Router } from 'wouter'

import { AuthProvider } from './lib/auth/AuthProvider'
import { Header } from './components/Header'
import { PageRouter } from './components/PageRouter'

function App() {
  return (
    <AuthProvider>
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
