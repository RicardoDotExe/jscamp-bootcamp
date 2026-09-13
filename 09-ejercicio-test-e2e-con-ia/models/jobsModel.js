import jobs from '../jobs.json' with { type: 'json' }

export class JobModel {
  // Obtener todos los trabajos con filtros y paginación
  static async getAll({
    text,
    title,
    level,
    technology,
    limit,
    offset
  }) {
    let filteredJobs = jobs

    // Filtro por texto libre
    if (text) {
      const searchTerm = text.toLowerCase()

      filteredJobs = filteredJobs.filter(job =>
        job.titulo.toLowerCase().includes(searchTerm) ||
        job.descripcion?.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por título
    if (title) {
      const titleSearch = title.toLowerCase()

      filteredJobs = filteredJobs.filter(job =>
        job.titulo.toLowerCase().includes(titleSearch)
      )
    }

    // Filtro por nivel
    if (level) {
      const levelSearch = level.toLowerCase()

      filteredJobs = filteredJobs.filter(job =>
        job.data?.nivel?.toLowerCase() === levelSearch
      )
    }

    // Filtro por tecnología
    if (technology) {
      const technologySearch = technology.toLowerCase()

      filteredJobs = filteredJobs.filter(job =>
        job.data?.technology?.some(tech =>
          tech.toLowerCase() === technologySearch
        )
      )
    }

    // Convertimos los parámetros de paginación a números
    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)

    // Paginación
    const paginatedJobs = filteredJobs.slice(
      offsetNumber,
      offsetNumber + limitNumber
    )

    return {
      data: paginatedJobs,
      total: filteredJobs.length,
      limit: limitNumber,
      offset: offsetNumber
    }
  }

  // Obtener un trabajo por su ID
  static async getById(id) {
    const job = jobs.find(job => job.id === id)

    return job
  }

  // Crear un trabajo
  static async create({
    titulo,
    empresa,
    ubicacion,
    descripcion = '',
    data = {},
    content = {}
  }) {
    const newJob = {
      id: crypto.randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content
    }

    jobs.push(newJob)

    return newJob
  }

  // Reemplazar completamente un trabajo
  static async update(id, {
    titulo,
    empresa,
    ubicacion,
    descripcion = '',
    data = {},
    content = {}
  }) {
    const jobIndex = jobs.findIndex(job => job.id === id)

    if (jobIndex === -1) {
      return null
    }

    const updatedJob = {
      id,
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content
    }

    jobs[jobIndex] = updatedJob

    return updatedJob
  }

  // Actualizar parcialmente un trabajo
  static async patch(id, changes) {
    const jobIndex = jobs.findIndex(job => job.id === id)

    if (jobIndex === -1) {
      return null
    }

    const currentJob = jobs[jobIndex]

    const updatedJob = {
      ...currentJob,
      ...changes,
      id: currentJob.id,
      data: changes.data
        ? {
            ...currentJob.data,
            ...changes.data
          }
        : currentJob.data,
      content: changes.content
        ? {
            ...currentJob.content,
            ...changes.content
          }
        : currentJob.content
    }

    jobs[jobIndex] = updatedJob

    return updatedJob
  }

  // Eliminar un trabajo
  static async delete(id) {
    const jobIndex = jobs.findIndex(job => job.id === id)

    if (jobIndex === -1) {
      return null
    }

    const [deletedJob] = jobs.splice(jobIndex, 1)

    return deletedJob
  }
}