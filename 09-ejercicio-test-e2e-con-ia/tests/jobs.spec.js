// @ts-check

import { expect, test } from '@playwright/test'

const URL = 'http://localhost:5173'

test.describe('DevJobs - Tests E2E', () => {
  // Ejercicio 2: la letra pide la página principal, no /search
  test('debería mostrar el buscador en la página principal', async ({ page }) => {
    await page.goto(URL)

    await expect(page.locator('form[role="search"]')).toBeVisible()
    await expect(page.getByRole('searchbox')).toBeVisible()
  })

  // Ejercicio 3: se añade el clic en "Buscar" (obligatorio en la letra) y se verifica que el filtro afectó a los resultados
  test('debería buscar empleos por texto', async ({ page }) => {
    await page.goto(URL)

    const searchInput = page.getByRole('searchbox')

    await expect(searchInput).toBeVisible()
    await searchInput.fill('React')

    // El botón "Buscar" navega a /search?text=React
    await page.getByRole('button', { name: 'Buscar' }).click()

    const jobCards = page.locator('.job-listing-card')

    await expect(page).toHaveURL(/text=React/)
    await expect(jobCards.first()).toBeVisible()

    // El filtro de texto sí se aplicó: los resultados mencionan React
    await expect(jobCards.first()).toContainText(/react/i)
  })

  // Cambiamos `select` (CSS) por getByRole('combobox') para respetar la jerarquía de selectores y mejorar la accesibilidad y buenas prácticas en testing
  test('debería filtrar empleos por tecnología React', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const technologySelect = page.getByRole('combobox').first()

    await expect(technologySelect).toBeVisible()
    await technologySelect.selectOption({ value: 'react' })

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()
  })

  // Verificamos que TODOS los resultados sean remotos.
  test('debería filtrar empleos por modalidad remota', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const locationSelect = page.getByRole('combobox').nth(1)

    await expect(locationSelect).toBeVisible()
    await locationSelect.selectOption({ value: 'remoto' })

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    await expect(page).toHaveTitle(/Resultados 10/)

    const cardsCount = await jobCards.count()

    for (let i = 0; i < cardsCount; i++) {
      await expect(jobCards.nth(i)).toContainText('Remoto')
    }
  })

  test('debería filtrar empleos por nivel Senior', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const experienceSelect = page.getByRole('combobox').nth(2)

    await expect(experienceSelect).toBeVisible()
    await experienceSelect.selectOption({ value: 'senior' })

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    await expect(page).toHaveTitle(/Resultados 11/)
    await expect(page).toHaveURL(/level=senior/)
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

  // Eliminamos el `if` porque hacía pasar el test sin probar nada (el botón "siguiente" no tiene texto accesible, solo icono, por eso no funcionaba getByRole). Siempre debemos verificar que un test se rompa y luego que se corrija.
  test('debería cambiar de página usando la paginación', async ({ page }) => {
    await page.goto(`${URL}/search`)

    const jobCards = page.locator('.job-listing-card')

    await expect(jobCards.first()).toBeVisible()

    await expect(page.locator('.pagination')).toBeVisible()

    const firstPageFirstJob = await jobCards
      .first()
      .locator('h3')
      .textContent()

    // El botón "siguiente" es el último del nav de paginación
    const nextButton = page.locator('.pagination button').last()

    await expect(nextButton).toBeEnabled()
    await nextButton.click()

    await expect
      .poll(async () => await jobCards.first().locator('h3').textContent())
      .not.toBe(firstPageFirstJob)
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

  test('debería iniciar sesión, buscar "JavaScript" y aplicar a un empleo', async ({ page }) => {
    await page.goto(`${URL}/search`)

    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await page.getByRole('searchbox').fill('JavaScript')
    await expect(page).toHaveURL(/text=JavaScript/)

    const firstJobCard = page.locator('.job-listing-card').first()

    await expect(firstJobCard).toBeVisible()

    // Abrimos el detalle del primer resultado
    await firstJobCard.getByRole('link', { name: /ver detalles/i }).click()
    await expect(page).toHaveURL(/\/job\/.+/)

    // Volvemos a resultados y aplicamos desde la tarjeta
    await page.goBack()
    await firstJobCard.getByRole('button', { name: 'Aplicar', exact: true }).click()

    // El botón cambia a Aplicado
    await expect(firstJobCard.getByRole('button', { name: /aplicado/i })).toBeVisible()
  })

  test('debería aplicar a un empleo y ver el botón "¡Aplicado!"', async ({ page }) => {
    await page.goto(`${URL}/search`)

    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    const firstJobCard = page.locator('.job-listing-card').first()
    const applyButton = firstJobCard.getByRole('button', { name: 'Aplicar', exact: true })

    await expect(applyButton).toBeVisible()
    await applyButton.click()

    await expect(firstJobCard.getByRole('button', { name: /aplicado/i })).toBeVisible()
  })
})
