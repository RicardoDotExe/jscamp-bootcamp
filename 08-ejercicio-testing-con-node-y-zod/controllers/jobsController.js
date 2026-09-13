import { JobModel } from '../models/jobsModel.js'
import { DEFAULTS } from '../config.js'

export class JobController {
  // GET /jobs
  static async getAll(req, res) {
    try {
      const {
        text,
        title,
        level,
        technology,
        limit = DEFAULTS.LIMIT_PAGINATION,
        offset = DEFAULTS.LIMIT_OFFSET
      } = req.query

      const result = await JobModel.getAll({
        text,
        title,
        level,
        technology,
        limit,
        offset
      })

      return res.json(result)
    } catch (error) {
      console.error('Error getting jobs:', error)

      return res.status(500).json({
        error: 'Error getting jobs'
      })
    }
  }

  // GET /jobs/:id
  static async getId(req, res) {
    try {
      const { id } = req.params

      const job = await JobModel.getById(id)

      if (!job) {
        return res.status(404).json({
          error: 'Job not found'
        })
      }

      return res.json(job)
    } catch (error) {
      console.error('Error getting job:', error)

      return res.status(500).json({
        error: 'Error getting job'
      })
    }
  }

  // POST /jobs
  static async create(req, res) {
    try {
      const {
        titulo,
        empresa,
        ubicacion,
        descripcion,
        data,
        content
      } = req.body

      if (!titulo || !empresa || !ubicacion) {
        return res.status(400).json({
          error: 'titulo, empresa and ubicacion are required'
        })
      }

      const newJob = await JobModel.create({
        titulo,
        empresa,
        ubicacion,
        descripcion,
        data,
        content
      })

      return res.status(201).json(newJob)
    } catch (error) {
      console.error('Error creating job:', error)

      return res.status(500).json({
        error: 'Error creating job'
      })
    }
  }

  // PUT /jobs/:id
  // Reemplaza completamente el recurso
  static async update(req, res) {
    try {
      const { id } = req.params

      const {
        titulo,
        empresa,
        ubicacion,
        descripcion,
        data,
        content
      } = req.body

      if (!titulo || !empresa || !ubicacion) {
        return res.status(400).json({
          error: 'titulo, empresa and ubicacion are required'
        })
      }

      const updatedJob = await JobModel.update(id, {
        titulo,
        empresa,
        ubicacion,
        descripcion,
        data,
        content
      })

      if (!updatedJob) {
        return res.status(404).json({
          error: 'Job not found'
        })
      }

      return res.json(updatedJob)
    } catch (error) {
      console.error('Error updating job:', error)

      return res.status(500).json({
        error: 'Error updating job'
      })
    }
  }

  // PATCH /jobs/:id
  // Actualiza parcialmente el recurso
  static async patch(req, res) {
    try {
      const { id } = req.params

      const updatedJob = await JobModel.patch(id, req.body)

      if (!updatedJob) {
        return res.status(404).json({
          error: 'Job not found'
        })
      }

      return res.json(updatedJob)
    } catch (error) {
      console.error('Error patching job:', error)

      return res.status(500).json({
        error: 'Error patching job'
      })
    }
  }

  // DELETE /jobs/:id
  static async delete(req, res) {
    try {
      const { id } = req.params

      const deletedJob = await JobModel.delete(id)

      if (!deletedJob) {
        return res.status(404).json({
          error: 'Job not found'
        })
      }

      return res.json({
        message: 'Job deleted successfully',
        data: deletedJob
      })
    } catch (error) {
      console.error('Error deleting job:', error)

      return res.status(500).json({
        error: 'Error deleting job'
      })
    }
  }
}