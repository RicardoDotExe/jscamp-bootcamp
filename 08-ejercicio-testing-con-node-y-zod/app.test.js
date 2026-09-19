import assert from 'node:assert'
import { after, before, describe, test } from 'node:test'

/* import app from './app.js' */
// Activamos NODE_ENV=test para que app.js no levante el servidor de desarrollo (1234) durante los tests
process.env.NODE_ENV = 'test'

// Import dinámico porque NODE_ENV se asignaría demasiado tarde
const { default: app } = await import('./app.js')

let server

const PORT = 3456

const BASE_URL = `http://localhost:${PORT}`

// Antes de todos los tests, se ejecuta para levantar el servidor
before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())

    server.on('error', reject)
  })
})

// Después de los tests, se ejecuta para cerrar el servidor
after(async () => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err)

      resolve()
    })
  })
})

// TESTS
describe('GET /jobs', () => {
  test('debe responder con 200 y un array de trabajos', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      Array.isArray(json.data),
      'data debe ser un array'
    )
  })

  test('debe filtrar trabajos por tecnología', async () => {
    const tech = 'react'
    const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      json.data.every(job =>
        job.data.technology.some(
          technology => technology.toLowerCase() === tech.toLowerCase()
        )
      ),
      `Todos los trabajos deben incluir la tecnología ${tech}`
    )
  })

  // Paginación requerida por el enunciado
  test('debe respetar el límite de resultados', async () => {
    const response = await fetch(`${BASE_URL}/jobs?limit=2`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(json.limit, 2)
    assert.strictEqual(json.data.length, 2)
  })

  test('debe aplicar offset correctamente', async () => {
    const response = await fetch(`${BASE_URL}/jobs?offset=1`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()

    // El segundo job del jobs.json
    assert.strictEqual(json.data[0].id, 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57')
  })
})

describe('POST /jobs', () => {
  // Helper para no repetir la configuración de fetch en cada caso
  const createJob = (body) =>
    fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

  test('crea el job con 201, id generado y datos coincidentes', async () => {
    const newJob = { titulo: 'Ingeniero DevOps', empresa: 'CloudTech', ubicacion: 'Remoto' }

    const response = await createJob(newJob)
    assert.strictEqual(response.status, 201)

    const json = await response.json()

    assert.ok(json.id)
    assert.strictEqual(json.titulo, newJob.titulo)
    assert.strictEqual(json.empresa, newJob.empresa)
    assert.strictEqual(json.ubicacion, newJob.ubicacion)
  })

  test('rechaza títulos inválidos con 400', async () => {
    const base = { empresa: 'CloudTech', ubicacion: 'Remoto' }
    const casos = [
      { ...base, titulo: 'ab' },            // menos de 3 caracteres
      { ...base, titulo: 'x'.repeat(101) }, // más de 100 caracteres
      { ...base },                          // sin titulo
      { ...base, titulo: 123 }              // titulo que no es string
    ]

    for (const body of casos) {
      const response = await createJob(body)
      assert.strictEqual(response.status, 400)
    }
  })

  test('crea un job sin descripcion porque es opcional', async () => {
    const response = await createJob({
      titulo: 'Backend Developer',
      empresa: 'Acme',
      ubicacion: 'Remoto'
    })

    assert.strictEqual(response.status, 201)
  })
})

describe('GET /jobs/:id', () => {
  test('devuelve el job cuyo id coincide', async () => {
    const id = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'

    const response = await fetch(`${BASE_URL}/jobs/${id}`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(json.id, id)
  })

  test('devuelve 404 con campo error si el id no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/id-inexistente`)
    assert.strictEqual(response.status, 404)

    const json = await response.json()

    assert.ok(json.error)
  })
})

describe('PUT /jobs/:id', () => {
  test('reemplaza el job completo y responde 204', async () => {
    const id = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'DevOps Engineer',
        empresa: 'Cloud Services SA',
        ubicacion: 'Híbrido',
        descripcion: 'Descripción actualizada',
        data: { technology: ['docker', 'kubernetes'], modalidad: 'hibrido', nivel: 'senior' },
        content: { description: 'Descripción del puesto actualizada' }
      })
    })
    assert.strictEqual(response.status, 204)

    // Verificamos con un GET que el reemplazo se aplicó
    const job = await (await fetch(`${BASE_URL}/jobs/${id}`)).json()

    assert.strictEqual(job.ubicacion, 'Híbrido')
    assert.strictEqual(job.descripcion, 'Descripción actualizada')
  })

  test('devuelve 404 si el id no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/id-inexistente`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Test', empresa: 'Test', ubicacion: 'Test' })
    })

    assert.strictEqual(response.status, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  test('actualiza solo los campos enviados y responde 204', async () => {
    const id = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'

    // Leemos el estado previo para comprobar que el resto de campos no cambia
    const { descripcion: descripcionAntes } =
      await (await fetch(`${BASE_URL}/jobs/${id}`)).json()

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'DevOps Engineer', ubicacion: 'Híbrido' })
    })
    assert.strictEqual(response.status, 204)

    const job = await (await fetch(`${BASE_URL}/jobs/${id}`)).json()

    assert.strictEqual(job.titulo, 'DevOps Engineer')
    assert.strictEqual(job.ubicacion, 'Híbrido')
    assert.strictEqual(job.descripcion, descripcionAntes)
  })

  test('devuelve 404 si el id no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/id-inexistente`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Test' })
    })

    assert.strictEqual(response.status, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  test('elimina el job y responde 204', async () => {
    // Creamos un job propio para que el test sea independiente del resto
    const createResponse = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Job a eliminar', empresa: 'Test SA', ubicacion: 'Remoto' })
    })
    const { id } = await createResponse.json()

    const deleteResponse = await fetch(`${BASE_URL}/jobs/${id}`, { method: 'DELETE' })
    assert.strictEqual(deleteResponse.status, 204)

    // Verificamos que ya no existe
    const getResponse = await fetch(`${BASE_URL}/jobs/${id}`)
    assert.strictEqual(getResponse.status, 404)
  })

  test('devuelve 404 si el id no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/id-inexistente`, { method: 'DELETE' })

    assert.strictEqual(response.status, 404)
  })
})
