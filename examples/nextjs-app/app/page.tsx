'use client'

import { useSession, signOut, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const session = useSession()
  const user = session.data?.user
  const isAuthenticated = !!user

  return (
    <div className="bg-slate-100 min-h-screen">
      <main role="main" className="flex flex-col items-center justify-center h-5/6 space-y-8 text-center px-4 py-16 lg:pt-32 md:pt-16 sm:pt-8">
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:max-w-[43.5rem]">
          Next.js Application Example using OpenID Connect
        </h1>
        <p className="mt-4 max-w-lg text-lg text-slate-700">
          This example demonstrates how to authenticate users in a Next.js Application using OpenID Connect Protocol.
        </p>
        {isAuthenticated ? (
          <Button onClick={() => signOut()}>
            Logout
          </Button>
        ) : (
          <Button onClick={() => signIn('testid')}>
            Login with TestID
          </Button>
        )}
        <p className="mt-4 max-w-lg text-slate-700">
          If you want to checkout out how to implement OpenID Connect in your Next.js app, take a look at the <a className="text-indigo-600" href="https://github.com/cerberauth/openid-connect-examples/tree/main/examples/nextjs-app">source code</a>.
        </p>
      </main>

      <footer className="text-center py-4">
        <p className="text-sm text-gray-500">
          Proudly part of <a className="text-indigo-600" href="https://www.cerberauth.com">CerberAuth</a> community.
        </p>
      </footer>
    </div>
  )
}
