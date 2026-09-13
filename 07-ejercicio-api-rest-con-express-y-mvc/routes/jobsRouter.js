import { Router } from 'express'
import { JobController } from '../controllers/jobsController.js'

export const jobsRouter = Router()

// GET /jobs
// Obtener todos los trabajos, con filtros y paginación
jobsRouter.get('/', JobController.getAll)

// GET /jobs/:id
// Obtener un trabajo concreto
jobsRouter.get('/:id', JobController.getId)

// POST /jobs
// Crear un trabajo
jobsRouter.post('/', JobController.create)

// PUT /jobs/:id
// Reemplazar un trabajo completo
jobsRouter.put('/:id', JobController.update)

// PATCH /jobs/:id
// Actualizar parcialmente un trabajo
jobsRouter.patch('/:id', JobController.patch)

// DELETE /jobs/:id
// Eliminar un trabajo
jobsRouter.delete('/:id', JobController.delete)