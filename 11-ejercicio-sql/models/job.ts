import crypto from 'node:crypto'
import db from '../db/database'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'

interface JobRow {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: Job['data']['modality']
  level: Job['data']['level']
  content_description: string
  responsibilities: string
  requirements: string
  about: string
}

interface TechnologyRow {
  name: string
}

function mapJobRow(row: JobRow, technologies: string[]): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: { technology: technologies, modality: row.modality, level: row.level },
    content: {
      description: row.content_description,
      responsibilities: row.responsibilities,
      requirements: row.requirements,
      about: row.about,
    },
  }
}

function getTechnologiesByJobId(jobId: string): string[] {
  const rows = db.prepare(`
    SELECT technologies.name
    FROM technologies
    INNER JOIN job_technologies ON technologies.id = job_technologies.technology_id
    WHERE job_technologies.job_id = ?
    ORDER BY technologies.name
  `).all(jobId) as TechnologyRow[]

  return rows.map((row) => row.name)
}

function getJobByIdFromDatabase(id: string): Job | undefined {
  const row = db.prepare(`
    SELECT id, title, company, location, description, modality, level,
           content_description, responsibilities, requirements, about
    FROM jobs
    WHERE id = ?
  `).get(id) as JobRow | undefined

  if (!row) return undefined

  return mapJobRow(row, getTechnologiesByJobId(id))
}

function normalizeTechnologies(technologies: string[]): string[] {
  return [...new Set(technologies.map((technology) => technology.toLowerCase().trim()).filter(Boolean))]
}

function updateTechnologies(jobId: string, technologies: string[]) {
  const deleteRelations = db.prepare(`DELETE FROM job_technologies WHERE job_id = ?`)
  const insertTechnology = db.prepare(`INSERT OR IGNORE INTO technologies (name) VALUES (?)`)
  const getTechnology = db.prepare(`SELECT id FROM technologies WHERE name = ?`)
  const insertRelation = db.prepare(`
    INSERT OR IGNORE INTO job_technologies (job_id, technology_id) VALUES (?, ?)
  `)

  deleteRelations.run(jobId)

  for (const technology of normalizeTechnologies(technologies)) {
    insertTechnology.run(technology)

    const technologyRow = getTechnology.get(technology) as { id: number } | undefined

    if (!technologyRow) {
      throw new Error(`No se pudo encontrar la tecnología: ${technology}`)
    }

    insertRelation.run(jobId, technologyRow.id)
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
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM job_technologies
          INNER JOIN technologies ON technologies.id = job_technologies.technology_id
          WHERE job_technologies.job_id = jobs.id
          AND LOWER(technologies.name) = LOWER(@tech)
        )
      `)
      params.tech = filters.tech
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const rows = db.prepare(`
      SELECT id, title, company, location, description, modality, level,
             content_description, responsibilities, requirements, about
      FROM jobs
      ${whereClause}
      ORDER BY title ASC
    `).all(params) as JobRow[]

    return rows.map((row) => mapJobRow(row, getTechnologiesByJobId(row.id)))
  }

  static async getById(id: string): Promise<Job | undefined> {
    return getJobByIdFromDatabase(id)
  }

  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = { id: crypto.randomUUID(), ...input }
    const technologies = normalizeTechnologies(input.data.technology)

    const insertJob = db.prepare(`
      INSERT INTO jobs (
        id, title, company, location, description, modality, level,
        content_description, responsibilities, requirements, about
      ) VALUES (
        @id, @title, @company, @location, @description, @modality, @level,
        @contentDescription, @responsibilities, @requirements, @about
      )
    `)

    const insertTechnology = db.prepare(`INSERT OR IGNORE INTO technologies (name) VALUES (?)`)
    const getTechnology = db.prepare(`SELECT id FROM technologies WHERE name = ?`)
    const insertRelation = db.prepare(`
      INSERT INTO job_technologies (job_id, technology_id) VALUES (?, ?)
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
        contentDescription: newJob.content?.description ?? '',
        responsibilities: newJob.content?.responsibilities ?? '',
        requirements: newJob.content?.requirements ?? '',
        about: newJob.content?.about ?? '',
      })

      for (const technology of technologies) {
        insertTechnology.run(technology)

        const technologyRow = getTechnology.get(technology) as { id: number } | undefined

        if (!technologyRow) {
          throw new Error(`No se pudo encontrar la tecnología: ${technology}`)
        }

        insertRelation.run(newJob.id, technologyRow.id)
      }
    })

    transaction()
    return newJob
  }

  static async delete(id: string): Promise<boolean> {
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
          level = @level,
          content_description = @contentDescription,
          responsibilities = @responsibilities,
          requirements = @requirements,
          about = @about
      WHERE id = @id
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
        contentDescription: updatedJob.content?.description ?? '',
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