# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/tests/example.spec.js >> buscar empleos y aplicar a una oferta
- Location: e2e/tests/example.spec.js:4:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Aplicar' }).first()
    - locator resolved to <button disabled class="button-apply-job">Inicia sesión para aplicar</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    14 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying
    - locator resolved to <button disabled class="button-apply-job">Inicia sesión para aplicar</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    38 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link [ref=e4] [cursor=pointer]:
      - /url: /
      - heading "DevJobs" [level=1] [ref=e5]
    - navigation [ref=e9]:
      - link "Inicio" [ref=e10] [cursor=pointer]:
        - /url: /
      - link "Empleos":
        - /url: /search
    - button "Iniciar sesión" [ref=e11] [cursor=pointer]
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Encuentra tu próximo trabajo" [level=1] [ref=e14]
      - paragraph [ref=e15]: Explora miles de oportunidades en el sector tecnológico
      - search [ref=e16]:
        - textbox "Buscar trabajos, empresas o habilidades" [ref=e22]
        - generic [ref=e23]:
          - combobox [ref=e24] [cursor=pointer]:
            - option "Tecnología" [selected]
            - option "JavaScript"
            - option "React"
            - option "Angular"
            - option "Node.js"
            - option "Python"
            - option "Java"
            - option "C#"
            - option "C"
            - option "C++"
            - option "Ruby"
            - option "PHP"
          - combobox [ref=e25] [cursor=pointer]:
            - option "Ubicación" [selected]
            - option "Remoto"
            - option "Ciudad de México"
            - option "Guadalajara"
            - option "Monterrey"
            - option "Barcelona"
            - option "Madrid"
          - combobox [ref=e26] [cursor=pointer]:
            - option "Nivel de experiencia" [selected]
            - option "Junior"
            - option "Mid-level"
            - option "Senior"
            - option "Lead"
    - generic [ref=e27]:
      - generic [ref=e28]:
        - heading "Resultados de búsqueda" [level=2] [ref=e29]
        - generic [ref=e30]:
          - article [ref=e31]:
            - generic [ref=e32]:
              - heading "Desarrollador de Software Senior" [level=3] [ref=e33]
              - generic [ref=e34]: Tech Solutions Inc. | Remoto
              - paragraph [ref=e35]: Buscamos un ingeniero de software con experiencia en desarrollo web y conocimientos en JavaScript, React y Node.js. El candidato ideal debe ser capaz de trabajar en equipo y tener buenas habilidades de comunicación.
            - link "Ver detalles" [ref=e36] [cursor=pointer]:
              - /url: /job/7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4
            - button "Inicia sesión para aplicar" [disabled]
            - button "🤍" [disabled]
          - article [ref=e37]:
            - generic [ref=e38]:
              - heading "Analista de Datos" [level=3] [ref=e39]
              - generic [ref=e40]: Data Driven Co. | Ciudad de México
              - paragraph [ref=e41]: Estamos buscando un analista de datos con experiencia en el manejo de grandes conjuntos de datos y herramientas de visualización. Se requiere conocimiento en SQL, Python y R.
            - link "Ver detalles" [ref=e42] [cursor=pointer]:
              - /url: /job/d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57
            - button "Inicia sesión para aplicar" [disabled]
            - button "🤍" [disabled]
          - article [ref=e43]:
            - generic [ref=e44]:
              - heading "Desarrollador de Aplicaciones Móviles" [level=3] [ref=e45]
              - generic [ref=e46]: Mobile Apps Ltd. | Guadalajara
              - paragraph [ref=e47]: Buscamos un desarrollador de aplicaciones móviles con experiencia en iOS y/o Android. El candidato debe tener conocimientos en Swift, Kotlin y el desarrollo de interfaces de usuario.
            - link "Ver detalles" [ref=e48] [cursor=pointer]:
              - /url: /job/e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d
            - button "Inicia sesión para aplicar" [disabled]
            - button "🤍" [disabled]
          - article [ref=e49]:
            - generic [ref=e50]:
              - heading "Ingeniero de DevOps" [level=3] [ref=e51]
              - generic [ref=e52]: Cloud Services SA | Remoto
              - paragraph [ref=e53]: Estamos buscando un ingeniero de DevOps con experiencia en la gestión de infraestructuras en la nube, automatización de procesos y herramientas de integración continua. Se requiere conocimiento en AWS, Azure o GCP.
            - link "Ver detalles" [ref=e54] [cursor=pointer]:
              - /url: /job/f62d8a34-923a-4ac2-9b0b-14e0ac2f5405
            - button "Inicia sesión para aplicar" [disabled]
            - button "🤍" [disabled]
          - article [ref=e55]:
            - generic [ref=e56]:
              - heading "Diseñador UX/UI" [level=3] [ref=e57]
              - generic [ref=e58]: Creative Minds Studio | Barcelona
              - paragraph [ref=e59]: Estamos buscando un diseñador UX/UI con pasión por crear experiencias digitales excepcionales. Se requiere experiencia en Figma, diseño centrado en el usuario y colaboración con equipos de desarrollo.
            - link "Ver detalles" [ref=e60] [cursor=pointer]:
              - /url: /job/a9f31a8e-ec38-4fd3-9114-88cc6d37a92b
            - button "Inicia sesión para aplicar" [disabled]
            - button "🤍" [disabled]
      - generic [ref=e61]:
        - navigation [ref=e62]:
          - button [disabled]
          - button "1"
          - button "2" [ref=e63] [cursor=pointer]
          - button "3" [ref=e64] [cursor=pointer]
          - button "4" [ref=e65] [cursor=pointer]
          - button "5" [ref=e66] [cursor=pointer]
          - button "6" [ref=e67] [cursor=pointer]
          - button "7" [ref=e68] [cursor=pointer]
          - button [ref=e69] [cursor=pointer]
        - generic [ref=e72]:
          - paragraph [ref=e73]: "Resultados por página:"
          - combobox [ref=e74] [cursor=pointer]:
            - option "5" [selected]
            - option "10"
            - option "20"
            - option "50"
  - contentinfo [ref=e75]: © 2025 DevJobs. Todos los derechos reservados.
```

# Test source

```ts
  1  | //@ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test('buscar empleos y aplicar a una oferta', async ({ page }) => {
  5  |   await page.goto('http://localhost:5173')
  6  | 
  7  |   const searchInput = page.getByRole('searchbox')
  8  |   await searchInput.fill('React')
  9  | 
  10 |   await page.getByRole('button', { name: 'Buscar'}).click()
  11 | 
  12 |   const jobCards = page.locator('.job-listing-card')
  13 | 
  14 |   await expect(jobCards.first()).toBeVisible()
  15 | 
  16 |   const firstJobTitle = jobCards.first().locator('h3')
  17 |   await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')
  18 | 
  19 |   await page.getByRole('button', { name: 'Iniciar sesión'}).first()
  20 |   
  21 |   const applyButton = page.getByRole('button', { name: 'Aplicar'}).first()
> 22 |   await applyButton.click()
     |                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  23 | 
  24 |   page.getByRole('button', { name: 'Aplicado'}).first()
  25 | })
```