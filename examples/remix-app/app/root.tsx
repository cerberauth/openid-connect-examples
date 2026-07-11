import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import appStylesHref from './app.css?url'
import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
]

export const meta: Route.MetaFunction = () => [
  { title: 'Remix Application Example using OpenID Connect' },
  {
    name: 'description',
    content: 'This example demonstrates how to authenticate users in a Remix Application using OpenID Connect Protocol.',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 min-h-screen font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
