import { test, expect } from '@playwright/test'

// Smoke regression for the master-planner initiative.
//
// Strategy: the app requires authentication, so the landing route renders the
// login / entry screen. We assert the app boots and the core navigation targets
// are reachable (or redirect to auth). This proves the build + routing + Playwright
// harness work before richer per-feature specs are added in later releases.
//
// If a real authenticated session is wired later, extend this to open /today and a
// project after seeding a signed-in state.
test('app boots and serves the entry screen', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBeLessThan(500)

  // The brand should be present on the landing/entry screen.
  await expect(page.getByText('Taski', { exact: false }).first()).toBeVisible()
})

test('today route is reachable', async ({ page }) => {
  const response = await page.goto('/today')
  // 200 or a redirect to auth are both acceptable for a smoke check.
  expect(response?.status()).toBeLessThan(500)
})
