import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Next.js Application Example using OpenID Connect',
  description: 'This example demonstrates how to authenticate users in a Next.js Application using OpenID Connect Protocol.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "bg-slate-100 min-h-screen font-sans antialiased",
        fontSans.variable,
      )}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
