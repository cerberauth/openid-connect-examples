import { defineMiddleware } from 'astro:middleware'
import { getAuth } from './lib/auth'

const protectedRoutes = ['/profile']

export const onRequest = defineMiddleware(async (context, next) => {
  // Better Auth handles its own endpoints.
  if (context.url.pathname.startsWith('/api/auth')) {
    return next()
  }

  const session = await getAuth().api.getSession({ headers: context.request.headers })

  context.locals.user = session?.user ?? null
  context.locals.session = session?.session ?? null

  if (!session && protectedRoutes.some((route) => context.url.pathname.startsWith(route))) {
    return context.redirect('/')
  }

  return next()
})
