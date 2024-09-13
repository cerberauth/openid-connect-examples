import { getCookie } from 'hono/cookie'
import { getUser } from './lib/oidc'
import { CookieName } from './cookies'

import { HomePage } from './pages/home'
import { app } from './app'
import './routes/login'
import './routes/callback'
import './routes/logout'

app.get('/', (c) => {
  const user = getUser({ idToken: getCookie(c, CookieName.IdToken) })
  return c.html(<HomePage user={user} />)
})

export default app
