import { getAuthenticator } from '~/services/auth.server'
import type { Route } from './+types/auth.testid'

export async function action({ request }: Route.ActionArgs) {
  const authenticator = await getAuthenticator()
  return authenticator.authenticate('testid', request)
}
