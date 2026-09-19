import crypto from 'node:crypto'
import db from '../db/database'
import type { CreateJobDTO, Job, JobFilters, UpdateJobDTO } from '../types'

interface JobRow {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: Job['data']['modality']
  level: Job['data']['level']
}

// El contenido detallado vive en su propia tabla job_content.
interface ContentRow {
  description: string
  responsibilities: string
  requirements: string
  about: string
}

function mapJobRow(row: JobRow, technologies: string[], content: ContentRow): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: { technology: technologies, modality: row.modality, level: row.level },
    content: {
      description: content.description,
      responsibilities: content.responsibilities,
      requirements: content.requirements,
      about: content.about,
    },
  }
}

// La tecnología es texto en job_technologies: no hace falta JOIN.
function getTechnologiesByJobId(jobId: string): string[] {
  const rows = db.prepare(`
    SELECT technology
    FROM job_technologies
    WHERE job_id = ?
    ORDER BY technology
  `).all(jobId) as { technology: string }[]

  return rows.map((row) => row.technology)
}

// Cada job tiene una fila de contenido en job_content.
function getJobContentByJobId(jobId: string): ContentRow {
  const row = db.prepare(`
    SELECT description, responsibilities, requirements, about
    FROM job_content
    WHERE job_id = ?
  `).get(jobId) as ContentRow | undefined

  return row ?? { description: '', responsibilities: '', requirements: '', about: '' }
}

function getJobByIdFromDatabase(id: string): Job | undefined {
  const row = db.prepare(`
    SELECT id, title, company, location, description, modality, level
    FROM jobs
    WHERE id = ?
  `).get(id) as JobRow | undefined

  if (!row) return undefined

  return mapJobRow(row, getTechnologiesByJobId(id), getJobContentByJobId(id))
}

function normalizeTechnologies(technologies: string[]): string[] {
  return [...new Set(technologies.map((technology) => technology.toLowerCase().trim()).filter(Boolean))]
}

function updateTechnologies(jobId: string, technologies: string[]) {
  // Al ser texto plano, basta con borrar las relaciones del job y reinsertarlas.
  db.prepare(`DELETE FROM job_technologies WHERE job_id = ?`).run(jobId)

  const insertRelation = db.prepare(`
    INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)
  `)

  for (const technology of normalizeTechnologies(technologies)) {
    insertRelation.run(jobId, technology)
  }
}

export class JobModel {
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    const conditions: string[] = []
    const params: Record<string, string> = {}

    if (filters?.modality) {
      conditions.push('jobs.modality = @modality')
      params.modality = filters.modality
    }

    if (filters?.level) {
      conditions.push('jobs.level = @level')
      params.level = filters.level
    }

    if (filters?.tech) {
      // technology es texto plano: un EXISTS simple filtra.
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM job_technologies
          WHERE job_technologies.job_id = jobs.id
          AND LOWER(technology) = LOWER(@tech)
        )
      `)
      params.tech = filters.tech
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const rows = db.prepare(`
      SELECT id, title, company, location, description, modality, level
      FROM jobs
      ${whereClause}
      ORDER BY title ASC
    `).all(params) as JobRow[]

    return rows.map((row) => mapJobRow(row, getTechnologiesByJobId(row.id), getJobContentByJobId(row.id)))
  }

  static async getById(id: string): Promise<Job | undefined> {
    return getJobByIdFromDatabase(id)
  }

  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = { id: crypto.randomUUID(), ...input }
    const technologies = normalizeTechnologies(input.data.technology)

    const insertJob = db.prepare(`
      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (@id, @title, @company, @location, @description, @modality, @level)
    `)

    // job_content tiene id propio
    const insertContent = db.prepare(`
      INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
      VALUES (@id, @jobId, @description, @responsibilities, @requirements, @about)
    `)

    const insertRelation = db.prepare(`
      INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)
    `)

    const transaction = db.transaction(() => {
      insertJob.run({
        id: newJob.id,
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        description: newJob.description,
        modality: newJob.data.modality,
        level: newJob.data.level,
      })

      insertContent.run({
        id: crypto.randomUUID(),
        jobId: newJob.id,
        description: newJob.content?.description ?? '',
        responsibilities: newJob.content?.responsibilities ?? '',
        requirements: newJob.content?.requirements ?? '',
        about: newJob.content?.about ?? '',
      })

      for (const technology of technologies) {
        insertRelation.run(newJob.id, technology)
      }
    })

    transaction()
    return newJob
  }

  static async delete(id: string): Promise<boolean> {
    // El ON DELETE CASCADE limpia también job_technologies y job_content.
    const result = db.prepare(`DELETE FROM jobs WHERE id = ?`).run(id)
    return result.changes > 0
  }

  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const currentJob = getJobByIdFromDatabase(id)
    if (!currentJob) return null

    const updatedJob: Job = {
      ...currentJob,
      ...input,
      data: { ...currentJob.data, ...input.data },
      content: {
        description: input.content?.description ?? currentJob.content?.description ?? '',
        responsibilities: input.content?.responsibilities ?? currentJob.content?.responsibilities ?? '',
        requirements: input.content?.requirements ?? currentJob.content?.requirements ?? '',
        about: input.content?.about ?? currentJob.content?.about ?? '',
      },
    }

    const updateJob = db.prepare(`
      UPDATE jobs
      SET title = @title,
          company = @company,
          location = @location,
          description = @description,
          modality = @modality,
          level = @level
      WHERE id = @id
    `)

    const updateContent = db.prepare(`
      UPDATE job_content
      SET description = @description,
          responsibilities = @responsibilities,
          requirements = @requirements,
          about = @about
      WHERE job_id = @jobId
    `)

    const transaction = db.transaction(() => {
      updateJob.run({
        id,
        title: updatedJob.title,
        company: updatedJob.company,
        location: updatedJob.location,
        description: updatedJob.description,
        modality: updatedJob.data.modality,
        level: updatedJob.data.level,
      })

      // Cada job tiene una fila en job_content: la actualizamos, no la duplicamos.
      updateContent.run({
        jobId: id,
        description: updatedJob.content?.description ?? '',
        responsibilities: updatedJob.content?.responsibilities ?? '',
        requirements: updatedJob.content?.requirements ?? '',
        about: updatedJob.content?.about ?? '',
      })

      if (input.data?.technology) {
        updateTechnologies(id, input.data.technology)
      }
    })

    transaction()
    return getJobByIdFromDatabase(id) ?? null
  }
}
