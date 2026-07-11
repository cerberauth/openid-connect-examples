import { redirect } from 'react-router'

import { getAuthenticator, sessionStorage } from '~/services/auth.server'
import type { Route } from './+types/auth.callback'

export async function loader({ request }: Route.LoaderArgs) {
  const authenticator = await getAuthenticator()
  const user = await authenticator.authenticate('testid', request)

  const session = await sessionStorage.getSession(request.headers.get('cookie'))
  session.set('user', user)

  return redirect('/', {
    headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
  })
}
