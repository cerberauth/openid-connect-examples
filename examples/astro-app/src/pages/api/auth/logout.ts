import type { APIRoute } from 'astro'

import { clearUserSession } from '../../../lib/auth.server'

export const POST: APIRoute = ({ cookies, redirect }) => {
  clearUserSession(cookies)
  return redirect('/')
}
