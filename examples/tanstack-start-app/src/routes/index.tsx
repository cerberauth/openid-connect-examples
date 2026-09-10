import { createFileRoute } from '@tanstack/react-router'
import { Button, Card, CardContent } from '@cerberauth/ui'

import { useAuth } from '~/lib/auth/useAuth'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { login, logout, isAuthenticated } = useAuth()

  return (
    <div className="bg-surface min-h-screen">
      <main role="main" className="flex flex-col items-center justify-center h-5/6 space-y-8 text-center px-4 py-16 lg:pt-32 md:pt-16 sm:pt-8">
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-fg sm:text-5xl xl:max-w-[43.5rem]">
          TanStack Start Example using OpenID Connect
        </h1>
        <Card className="max-w-lg">
          <CardContent className="flex flex-col items-center space-y-8 text-center">
            <p className="text-lg text-on-surface-variant">
              This example demonstrates how to authenticate users in a TanStack Start application using OpenID Connect Protocol.
            </p>
            {isAuthenticated ? (
              <Button data-testid="logout-button" onClick={() => logout()}>
                Logout
              </Button>
            ) : (
              <Button data-testid="login-button" onClick={() => login()}>
                Login with TestID
              </Button>
            )}
          </CardContent>
        </Card>
        <p className="mt-4 max-w-lg text-on-surface-variant">
          If you want to checkout out how to implement OpenID Connect in your TanStack Start app, take a look at the <a className="text-primary" href="https://github.com/cerberauth/openid-connect-examples/tree/main/examples/tanstack-start-app">source code</a>.
        </p>
      </main>

      <footer className="text-center py-4">
        <p className="text-sm text-on-surface-variant">
          Proudly part of <a className="text-primary" href="https://www.cerberauth.com">CerberAuth</a> community.
        </p>
      </footer>
    </div>
  )
}
