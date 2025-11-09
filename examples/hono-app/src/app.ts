import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

type Bindings = {
  AUTH_ISSUER: string
  AUTH_CLIENT_ID: string
  AUTH_CLIENT_SECRET: string
  AUTH_REDIRECT_URI: string
  AUTH_POST_LOGOUT_REDIRECT_URI: string
}
export const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())
app.use(secureHeaders())
