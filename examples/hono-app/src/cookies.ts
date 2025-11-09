import type { Context } from 'hono'
import { deleteCookie } from 'hono/cookie'
import type { CookieOptions } from 'hono/utils/cookie'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'Lax',
  secure: true,
}

export enum CookieName {
  CodeVerifier = 'code_verifier',
  Nonce = 'nonce',
  State = 'state',
  ExpiresIn = 'expires_in',
  AccessToken = 'access_token',
  IdToken = 'id_token',
  RefreshToken = 'refresh_token',
}

export function cleanupCookies(c: Context) {
  deleteCookie(c, CookieName.ExpiresIn)
  deleteCookie(c, CookieName.AccessToken)
  deleteCookie(c, CookieName.IdToken)
  deleteCookie(c, CookieName.RefreshToken)
}
