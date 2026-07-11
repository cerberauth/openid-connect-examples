import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('auth/testid', 'routes/auth.testid.ts'),
  route('auth/callback', 'routes/auth.callback.ts'),
  route('auth/logout', 'routes/auth.logout.ts'),
] satisfies RouteConfig
