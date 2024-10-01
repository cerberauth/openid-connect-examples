import type { User } from '../lib/oidc'

type Props = {
  user?: User
}

export const HomePage = ({ user }: Props) => {
  const isAuthenticated = !!user

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://cerberauth-hono-oidc.pages.dev/" />
        <title>Hono Example using OpenID Connect</title>
      </head>

      <body>
        <div className="bg-slate-100 min-h-screen">
          <main role="main" className="flex flex-col items-center justify-center h-5/6 space-y-8 text-center px-4 py-16 lg:pt-32 md:pt-16 sm:pt-8">
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:max-w-[43.5rem]">
              Hono Example using OpenID Connect
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-700">
              This example demonstrates how to authenticate users in an Hono Application using OpenID Connect Protocol.
            </p>
            {isAuthenticated ? (
              <a
                className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
                href="/auth/logout"
              >
                Logout
              </a>
            ) : (
              <a
                className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
                href="/auth/login"
              >
                Login with TestID
              </a>
            )}
            <p className="mt-4 max-w-lg text-slate-700">
              If you want to checkout out how to implement OpenID Connect in your Hono app, take a look at the <a className="text-indigo-600" href="https://github.com/cerberauth/openid-connect-examples/tree/main/examples/hono">source code</a>.
            </p>
          </main>

          <footer className="text-center py-4">
            <p className="text-sm text-gray-500">
              Proudly part of <a className="text-indigo-600" href="https://www.cerberauth.com">CerberAuth</a> community.
            </p>
          </footer>
        </div>

        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  )
}
