process.loadEnvFile()

import { test } from 'node:test'
import assert from 'node:assert'

import { Stagehand } from '@browserbasehq/stagehand'

test('La página de La Velada contiene información sobre el evento', async () => {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    model: 'openai/gpt-5-mini'
  })

  const agent = stagehand.agent({
    mode: 'cua',
    model: {
      modelName: 'openai/computer-use-preview',
      apiKey: process.env.OPENAI_API_KEY
    },
    systemPrompt: 'Eres un agente de testing e2e para navegar por páginas web y comprobar información.'
  })

  await stagehand.init()

  const [page] = stagehand.context.pages()

  await page.goto('https://www.google.com/search?q=La+Velada+del+A%C3%B1o')

  const result = await agent.execute(
    'Busca información sobre La Velada del Año y dime qué es y quién organiza el evento.'
  )

  console.log(result)

  const { extraction } = await stagehand.extract(
    'Extrae una frase breve que explique qué es La Velada del Año.'
  )

  console.log('Información extraída:', extraction)

  assert.ok(extraction, 'Debería extraerse información del evento')

  await stagehand.close()
})