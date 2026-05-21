import { test, expect } from '@playwright/test'

test.describe('To-Do App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should display empty state on first load', async ({ page }) => {
    expect(await page.textContent('text=No tasks yet!')).toBeTruthy()
    expect(await page.textContent('text=Add a new task to get started')).toBeTruthy()
  })

  test('should add a new task', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    await input.fill('Buy groceries')
    await addButton.click()

    expect(await page.textContent('text=Buy groceries')).toBeTruthy()
    expect(await input.inputValue()).toBe('')
  })

  test('should add multiple tasks', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    const tasks = ['Buy groceries', 'Finish project', 'Call mom']

    for (const task of tasks) {
      await input.fill(task)
      await addButton.click()
      await page.waitForTimeout(100)
    }

    for (const task of tasks) {
      expect(await page.textContent(`text=${task}`)).toBeTruthy()
    }
  })

  test('should toggle task completion', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    await input.fill('Buy groceries')
    await addButton.click()

    const checkbox = page.locator('input[type="checkbox"]').first()
    expect(await checkbox.isChecked()).toBe(false)

    await checkbox.click()
    expect(await checkbox.isChecked()).toBe(true)

    const taskText = page.locator('button', { hasText: 'Buy groceries' })
    const classList = await taskText.evaluate((el) => el.className)
    expect(classList).toContain('line-through')
  })

  test('should delete a task', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    await input.fill('Buy groceries')
    await addButton.click()

    expect(await page.textContent('text=Buy groceries')).toBeTruthy()

    const deleteButton = page.locator('button', { hasText: '×' }).first()
    await deleteButton.click()

    expect(await page.textContent('text=Buy groceries')).toBeFalsy()
    expect(await page.textContent('text=No tasks yet!')).toBeTruthy()
  })

  test('should persist tasks to localStorage', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    await input.fill('Buy groceries')
    await addButton.click()

    await input.fill('Finish project')
    await addButton.click()

    // Reload the page
    await page.reload()

    // Both tasks should still be there
    expect(await page.textContent('text=Buy groceries')).toBeTruthy()
    expect(await page.textContent('text=Finish project')).toBeTruthy()
  })

  test('should allow adding task with Enter key', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')

    await input.fill('Call mom')
    await input.press('Enter')

    expect(await page.textContent('text=Call mom')).toBeTruthy()
    expect(await input.inputValue()).toBe('')
  })

  test('should not add empty tasks', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    expect(await addButton.isDisabled()).toBe(true)

    await input.fill('   ')
    expect(await addButton.isDisabled()).toBe(true)

    await input.clear()
    expect(await addButton.isDisabled()).toBe(true)
  })

  test('should preserve task state after reload', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })
    const checkbox = page.locator('input[type="checkbox"]').first()

    // Add a task
    await input.fill('Buy groceries')
    await addButton.click()

    // Mark as complete
    await checkbox.click()
    expect(await checkbox.isChecked()).toBe(true)

    // Reload
    await page.reload()

    // Task should still be complete
    const reloadedCheckbox = page.locator('input[type="checkbox"]').first()
    expect(await reloadedCheckbox.isChecked()).toBe(true)

    const taskText = page.locator('button', { hasText: 'Buy groceries' })
    const classList = await taskText.evaluate((el) => el.className)
    expect(classList).toContain('line-through')
  })

  test('should work across all browsers', async ({ page, browserName }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]')
    const addButton = page.locator('button', { hasText: 'Add' })

    await input.fill(`Task from ${browserName}`)
    await addButton.click()

    expect(await page.textContent(`text=Task from ${browserName}`)).toBeTruthy()
  })
})
