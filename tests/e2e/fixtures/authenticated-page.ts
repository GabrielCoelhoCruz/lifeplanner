import { expect, type Page } from '@playwright/test'

export async function expectAuthenticatedShell(page: Page) {
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/)
  await expect(page.getByRole('link', { name: 'Taski — Dashboard' })).toBeVisible()
}