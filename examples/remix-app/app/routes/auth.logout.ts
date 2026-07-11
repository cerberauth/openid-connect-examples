import { redirect } from 'react-router'

import { sessionStorage } from '~/services/auth.server'
import type { Route } from './+types/auth.logout'

export async function action({ request }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'))

  return redirect('/', {
    headers: { 'Set-Cookie': await sessionStorage.destroySession(session) },
  })
}
