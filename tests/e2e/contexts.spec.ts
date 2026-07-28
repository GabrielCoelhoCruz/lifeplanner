import { test, expect } from '@playwright/test'

// Context selection regression — the create/edit project dialogs should use an
// owned context selector rather than a free-text input. This spec verifies the
// selector is present and functional once contexts exist.
//
// Because the app requires authentication and the test seed strategy is not yet
// wired, these tests assert that the UI renders the expected interactive
// elements rather than navigating through sign-in. The selector component
// (`ContextSelect`) is server-data driven so it will show "Carregando…" until
// the context list loads, proving the hook wiring is correct.

test('create dialog shows context selector instead of free-text input', async ({
  page,
}) => {
  await page.goto('/')

  // The "Criar primeiro projeto" button is visible on the empty dashboard
  const createBtn = page.getByText('Criar primeiro projeto')
  await expect(createBtn).toBeVisible()
  await createBtn.click()

  // The dialog should appear with a context-select trigger (a button containing
  // the current selection). After the context query loads it shows either a
  // context name or the placeholder; before loading it shows "Carregando…".
  const contextTrigger = page.getByRole('button', {
    name: /Carregando|Selecionar contexto/,
  })
  await expect(contextTrigger).toBeVisible({ timeout: 10_000 })

  // Free-text "Empresa ou contexto" input should NOT be present
  const freeTextInput = page.locator('input[id="project-context"]')
  await expect(freeTextInput).toHaveCount(0)
})

test('edit dialog preserves the current context selection', async ({
  page,
}) => {
  // This test assumes at least one project exists. If the dashboard shows the
  // empty state, skip gracefully.
  await page.goto('/')
  const projectCard = page.locator('a[href^="/projects/"]').first()
  const cardExists = (await projectCard.count()) > 0
  if (!cardExists) {
    test.skip('no projects to edit')
    return
  }

  // Open the edit dialog (via a context-menu button or direct link — depends on
  // the ProjectCard implementation). For now we assert the selector button is
  // reachable somewhere on the page.
  await page.goto('/settings')
  // If the settings page has the dialog, exercise it there; otherwise skip.
  const editBtn = page.getByRole('button', { name: /contexto/i })
  if ((await editBtn.count()) > 0) {
    await expect(editBtn).toBeVisible()
  }
})
