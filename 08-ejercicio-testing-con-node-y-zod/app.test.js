import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'
import app from './app.js'

let server

const PORT = 3456
const BASE_URL = `http://localhost:${PORT}`

// Antes de todos los tests, levantamos el servidor
before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())

    server.on('error', reject)
  })
})

// Después de todos los tests, cerramos el servidor
after(async () => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err)

      resolve()
    })
  })
})

// =====================================================
// GET /jobs
// =====================================================

describe('GET /jobs', () => {
  test('debe responder con 200 y devolver un array de trabajos', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      Array.isArray(json.data),
      'data debe ser un array'
    )

    assert.ok(
      typeof json.total === 'number',
      'total debe ser un número'
    )
  })

  test('debe filtrar trabajos por tecnología', async () => {
    const tech = 'react'

    const response = await fetch(
      `${BASE_URL}/jobs?technology=${tech}`
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      json.data.every(job =>
        job.data?.technology?.some(
          technology =>
            technology.toLowerCase() === tech.toLowerCase()
        )
      ),
      `Todos los trabajos deben incluir la tecnología ${tech}`
    )
  })

  test('debe filtrar trabajos por título', async () => {
    const title = 'developer'

    const response = await fetch(
      `${BASE_URL}/jobs?title=${title}`
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      json.data.every(job =>
        job.titulo.toLowerCase().includes(title.toLowerCase())
      ),
      `Todos los trabajos deben incluir "${title}" en el título`
    )
  })

  test('debe filtrar trabajos por nivel', async () => {
    const level = 'junior'

    const response = await fetch(
      `${BASE_URL}/jobs?level=${level}`
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      json.data.every(job =>
        job.data?.nivel?.toLowerCase() === level.toLowerCase()
      ),
      `Todos los trabajos deben ser de nivel ${level}`
    )
  })

  test('debe filtrar trabajos por texto libre', async () => {
    const text = 'javascript'

    const response = await fetch(
      `${BASE_URL}/jobs?text=${text}`
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.ok(
      json.data.every(job => {
        const titulo = job.titulo?.toLowerCase() ?? ''
        const descripcion = job.descripcion?.toLowerCase() ?? ''

        return (
          titulo.includes(text.toLowerCase()) ||
          descripcion.includes(text.toLowerCase())
        )
      }),
      `Todos los trabajos deben contener "${text}" en título o descripción`
    )
  })

  test('debe aplicar la paginación correctamente', async () => {
    const limit = 2
    const offset = 0

    const response = await fetch(
      `${BASE_URL}/jobs?limit=${limit}&offset=${offset}`
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(
      json.data.length,
      limit,
      `Debe devolver ${limit} trabajos`
    )

    assert.strictEqual(json.limit, limit)
    assert.strictEqual(json.offset, offset)
  })

  test('debe devolver una página distinta usando offset', async () => {
    const firstResponse = await fetch(
      `${BASE_URL}/jobs?limit=1&offset=0`
    )

    const secondResponse = await fetch(
      `${BASE_URL}/jobs?limit=1&offset=1`
    )

    assert.strictEqual(firstResponse.status, 200)
    assert.strictEqual(secondResponse.status, 200)

    const firstJson = await firstResponse.json()
    const secondJson = await secondResponse.json()

    assert.notStrictEqual(
      firstJson.data[0].id,
      secondJson.data[0].id,
      'Las páginas no deberían devolver el mismo trabajo'
    )
  })
})

// =====================================================
// GET /jobs/:id
// =====================================================

describe('GET /jobs/:id', () => {
  test('debe devolver un trabajo existente por su ID', async () => {
    const listResponse = await fetch(`${BASE_URL}/jobs?limit=1`)
    const listJson = await listResponse.json()

    const job = listJson.data[0]

    const response = await fetch(
      `${BASE_URL}/jobs/${job.id}`
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(json.id, job.id)
    assert.strictEqual(json.titulo, job.titulo)
  })

  test('debe devolver 404 si el trabajo no existe', async () => {
    const fakeId = 'id-que-no-existe'

    const response = await fetch(
      `${BASE_URL}/jobs/${fakeId}`
    )

    assert.strictEqual(response.status, 404)
  })
})

// =====================================================
// POST /jobs
// =====================================================

describe('POST /jobs', () => {
  test('debe crear un nuevo trabajo y devolver 201', async () => {
    const newJob = {
      titulo: 'Backend Developer de testing',
      empresa: 'Empresa Test',
      ubicacion: 'Madrid',
      descripcion: 'Trabajo creado desde un test',
      data: {
        technology: ['Node.js', 'Express'],
        nivel: 'junior',
        modalidad: 'remoto'
      },
      content: {}
    }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newJob)
    })

    assert.strictEqual(response.status, 201)

    const json = await response.json()

    assert.ok(json.id, 'El trabajo creado debe tener un ID')
    assert.strictEqual(json.titulo, newJob.titulo)
    assert.strictEqual(json.empresa, newJob.empresa)
    assert.strictEqual(json.ubicacion, newJob.ubicacion)
  })

  test('debe devolver 400 si faltan campos obligatorios', async () => {
    const incompleteJob = {
      titulo: 'Trabajo incompleto'
    }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(incompleteJob)
    })

    assert.strictEqual(response.status, 400)
  })
})

// =====================================================
// PUT /jobs/:id
// =====================================================

describe('PUT /jobs/:id', () => {
  let jobId

  before(async () => {
    const newJob = {
      titulo: 'Trabajo para PUT',
      empresa: 'Empresa PUT',
      ubicacion: 'Madrid',
      descripcion: 'Trabajo original',
      data: {
        technology: ['JavaScript'],
        nivel: 'junior'
      },
      content: {}
    }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newJob)
    })

    const json = await response.json()
    jobId = json.id
  })

  test('debe reemplazar completamente un trabajo existente', async () => {
    const updatedJob = {
      titulo: 'Trabajo actualizado con PUT',
      empresa: 'Nueva Empresa',
      ubicacion: 'Barcelona',
      descripcion: 'Descripción actualizada',
      data: {
        technology: ['Node.js'],
        nivel: 'senior'
      },
      content: {}
    }

    const response = await fetch(
      `${BASE_URL}/jobs/${jobId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedJob)
      }
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(json.id, jobId)
    assert.strictEqual(json.titulo, updatedJob.titulo)
    assert.strictEqual(json.empresa, updatedJob.empresa)
    assert.strictEqual(json.ubicacion, updatedJob.ubicacion)
    assert.strictEqual(json.data.nivel, updatedJob.data.nivel)
  })

  test('debe devolver 404 si se intenta actualizar un trabajo inexistente', async () => {
    const response = await fetch(
      `${BASE_URL}/jobs/id-que-no-existe`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: 'Test',
          empresa: 'Empresa',
          ubicacion: 'Madrid'
        })
      }
    )

    assert.strictEqual(response.status, 404)
  })
})

// =====================================================
// PATCH /jobs/:id
// =====================================================

describe('PATCH /jobs/:id', () => {
  let jobId

  before(async () => {
    const newJob = {
      titulo: 'Trabajo para PATCH',
      empresa: 'Empresa PATCH',
      ubicacion: 'Madrid',
      descripcion: 'Descripción original',
      data: {
        technology: ['JavaScript'],
        nivel: 'junior',
        modalidad: 'remoto'
      },
      content: {}
    }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newJob)
    })

    const json = await response.json()
    jobId = json.id
  })

  test('debe actualizar parcialmente un trabajo', async () => {
    const changes = {
      titulo: 'Título modificado con PATCH'
    }

    const response = await fetch(
      `${BASE_URL}/jobs/${jobId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changes)
      }
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(json.id, jobId)
    assert.strictEqual(json.titulo, changes.titulo)
    assert.strictEqual(json.empresa, 'Empresa PATCH')
    assert.strictEqual(json.ubicacion, 'Madrid')
  })

  test('debe conservar los campos internos al actualizar data parcialmente', async () => {
    const response = await fetch(
      `${BASE_URL}/jobs/${jobId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            nivel: 'senior'
          }
        })
      }
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(json.data.nivel, 'senior')
    assert.strictEqual(
      json.data.modalidad,
      'remoto',
      'Debe conservar modalidad al actualizar solo nivel'
    )
  })

  test('debe devolver 404 si el trabajo no existe', async () => {
    const response = await fetch(
      `${BASE_URL}/jobs/id-que-no-existe`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: 'Test'
        })
      }
    )

    assert.strictEqual(response.status, 404)
  })
})

// =====================================================
// DELETE /jobs/:id
// =====================================================

describe('DELETE /jobs/:id', () => {
  let jobId

  before(async () => {
    const newJob = {
      titulo: 'Trabajo para DELETE',
      empresa: 'Empresa DELETE',
      ubicacion: 'Madrid',
      descripcion: 'Trabajo que será eliminado',
      data: {
        technology: ['Node.js']
      },
      content: {}
    }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newJob)
    })

    const json = await response.json()
    jobId = json.id
  })

  test('debe eliminar un trabajo existente', async () => {
    const response = await fetch(
      `${BASE_URL}/jobs/${jobId}`,
      {
        method: 'DELETE'
      }
    )

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    assert.strictEqual(
      json.message,
      'Job deleted successfully'
    )

    assert.strictEqual(json.data.id, jobId)
  })

  test('debe devolver 404 al intentar eliminar un trabajo inexistente', async () => {
    const response = await fetch(
      `${BASE_URL}/jobs/id-que-no-existe`,
      {
        method: 'DELETE'
      }
    )

    assert.strictEqual(response.status, 404)
  })
})