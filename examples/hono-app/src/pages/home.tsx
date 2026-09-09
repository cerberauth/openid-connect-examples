import { Link, ViteClient } from 'vite-ssr-components/hono'

import type { User } from '../lib/oidc'

type Props = {
  user?: User
}

const buttonClassName = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-fg hover:bg-primary/90'

export const HomePage = ({ user }: Props) => {
  const isAuthenticated = !!user

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />

        <link rel="canonical" href="https://hono-app-oidc.cerberauth.workers.dev/" />
        <title>Hono App Example using OpenID Connect</title>
      </head>

      <body>
        <div className="bg-surface min-h-screen">
          <main role="main" className="flex flex-col items-center justify-center h-5/6 space-y-8 text-center px-4 py-16 lg:pt-32 md:pt-16 sm:pt-8">
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-fg sm:text-5xl xl:max-w-[43.5rem]">
              Hono App Example using OpenID Connect
            </h1>
            <div className="max-w-lg rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col items-center space-y-8 text-center">
              <p className="text-lg text-on-surface-variant">
                This example demonstrates how to authenticate users in an Hono Application using OpenID Connect Protocol.
              </p>
              {isAuthenticated ? (
                <a
                  data-testid="logout-button"
                  className={buttonClassName}
                  href="/auth/logout"
                >
                  Logout
                </a>
              ) : (
                <a
                  data-testid="login-button"
                  className={buttonClassName}
                  href="/auth/login"
                >
                  Login with TestID
                </a>
              )}
            </div>
            <p className="mt-4 max-w-lg text-on-surface-variant">
              If you want to checkout out how to implement OpenID Connect in your Hono app, take a look at the <a className="text-primary" href="https://github.com/cerberauth/openid-connect-examples/tree/main/examples/hono-app">source code</a>.
            </p>
          </main>

          <footer className="text-center py-4">
            <p className="text-sm text-on-surface-variant">
              Proudly part of <a className="text-primary" href="https://www.cerberauth.com">CerberAuth</a> community.
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
