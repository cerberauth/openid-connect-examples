import { test, expect } from '@playwright/test'

test('login and logout', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('login-button')).toBeVisible()

  await page.getByTestId('login-button').click()

  // stubidp auto-approves (SKIP_PROMPT=true) and redirects back to the app
  await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 15000 })

  await page.getByTestId('logout-button').click()

  // end_session redirect brings user back to app in logged-out state
  await expect(page.getByTestId('login-button')).toBeVisible({ timeout: 15000 })
})
