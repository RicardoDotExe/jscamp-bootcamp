// @ts-check

import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5173'

test.describe('DevJobs - Tests E2E', () => {
  test('debería mostrar el buscador en la página de búsqueda', async ({ page }) => {
    await page.goto(`${URL}/search`)

    await expect(page.locator('form[role="search"]')).toBeVisible()
    await expect(page.getByRole('searchbox')).toBeVisible()
  })

  test('debería buscar empleos por texto', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const searchInput = page.getByRole('searchbox')

    await expect(searchInput).toBeVisible()
    await searchInput.fill('React')

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()
  })

  test('debería filtrar empleos por tecnología React', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const technologySelect = page.locator('select').nth(0)

    await expect(technologySelect).toBeVisible()
    await technologySelect.selectOption({ value: 'react' })

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()
  })

  test('debería filtrar empleos por modalidad remota', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const locationSelect = page.locator('select').nth(1)

    await expect(locationSelect).toBeVisible()
    await locationSelect.selectOption({ value: 'remoto' })

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    const cardsCount = await jobCards.count()

    expect(cardsCount).toBeGreaterThan(0)
  })

  test('debería filtrar empleos por nivel Senior', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const experienceSelect = page.locator('select').nth(2)

    await expect(experienceSelect).toBeVisible()
    await experienceSelect.selectOption({ value: 'senior' })

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    const cardsCount = await jobCards.count()

    expect(cardsCount).toBeGreaterThan(0)
  })

  test('debería iniciar sesión desde la cabecera y marcar un trabajo como favorito', async ({
    page
  }) => {
    await page.goto(`${URL}/search`)

    const loginButton = page.getByRole('button', {
      name: /iniciar sesión/i
    })

    await expect(loginButton).toBeVisible()
    await loginButton.click()

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    const firstJobCard = jobCards.first()

    const favoriteButton = firstJobCard.locator('button').filter({
      hasText: /🤍|❤️/
    })

    await expect(favoriteButton).toBeVisible()
    await expect(favoriteButton).toBeEnabled()

    await favoriteButton.click()

    await expect(favoriteButton).toContainText('❤️')
  })

  test('debería cambiar de página usando la paginación', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    const firstPageFirstJob = await jobCards
      .first()
      .locator('h3')
      .textContent()

    const nextButton = page.getByRole('button', {
      name: /siguiente/i
    })

    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click()

      await expect(jobCards.first()).toBeVisible()

      const secondPageFirstJob = await jobCards
        .first()
        .locator('h3')
        .textContent()

      expect(secondPageFirstJob).not.toBe(firstPageFirstJob)
    }
  })

  test('debería entrar al detalle de un empleo', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const firstJobCard = page.locator('.job-listing-card').first()

    await expect(firstJobCard).toBeVisible()

    await firstJobCard
      .getByRole('link', { name: /ver detalles/i })
      .click()

    await expect(page).toHaveURL(/\/job\/.+/)
  })
})