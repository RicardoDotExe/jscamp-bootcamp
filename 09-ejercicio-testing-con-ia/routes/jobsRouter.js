import { Router } from 'express'
import { JobController } from '../controllers/jobsController.js'
import { validateJob, validatePartialJob } from '../schemas/jobsSchema.js'

export const jobsRouter = Router()

function validateCreate(req, res, next) {
  const result = validateJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: result.error.issues
    })
  }

  req.body = result.data
  next()
}

function validatePartial(req, res, next) {
  const result = validatePartialJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: result.error.issues
    })
  }

  req.body = result.data
  next()
}

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)
jobsRouter.post('/', validateCreate, JobController.create)
jobsRouter.put('/:id', validateCreate, JobController.update)
jobsRouter.patch('/:id', validatePartial, JobController.patch)
jobsRouter.delete('/:id', JobController.delete)