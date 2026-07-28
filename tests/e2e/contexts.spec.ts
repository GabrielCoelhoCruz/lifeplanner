import { test, expect } from '@playwright/test'
import {
  expectAuthenticatedShell,
} from './fixtures/authenticated-page'

test('authenticated dashboard exposes context filtering and project creation', async ({
  page,
}) => {
  await page.goto('/')
  await expectAuthenticatedShell(page)

  await expect(page.getByRole('button', { name: 'Todos' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Criar novo' })).toBeVisible()
})

test('authenticated Today route renders the application shell on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/today')
  await expectAuthenticatedShell(page)
})

test('context filter persists in URL and localStorage across routes', async ({
  page,
}) => {
  await page.goto('/')
  await expectAuthenticatedShell(page)

  // 1. Navigate with a context param in the URL
  await page.goto('/today?context=e2e-test')
  await page.waitForURL(/context=e2e-test/)

  // 2. Verify it's captured in the URL
  expect(new URL(page.url()).searchParams.get('context')).toBe('e2e-test')

  // 3. Verify the hook synced it to localStorage
  const stored = await page.evaluate(() =>
    window.localStorage.getItem('selectedContextId'),
  )
  expect(stored).toBe('e2e-test')

  // 4. Go to Dashboard — localStorage still has the value
  await page.goto('/')
  const stored2 = await page.evaluate(() =>
    window.localStorage.getItem('selectedContextId'),
  )
  expect(stored2).toBe('e2e-test')

  // 5. Go back to Today with a different context
  await page.goto('/today?context=other-context')
  await page.waitForURL(/context=other-context/)
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('selectedContextId'),
    ),
  ).toBe('other-context')
})
