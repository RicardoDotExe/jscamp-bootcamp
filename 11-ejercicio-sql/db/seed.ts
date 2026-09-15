import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import db from './database'

interface SeedJob {
    id: string
    title: string
    company: string
    location: string
    description: string
    modality: 'remote' | 'onsite' | 'hybrid'
    level: 'junior' | 'mid' | 'senior'
    technologies: string[]
    content: {
        description: string
        responsibilities: string
        requirements: string
        about: string
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const jobsPath = path.join(__dirname, '..', 'jobs.json')
const jobs: SeedJob[] = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'))

function createTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
      level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior')),
      content_description TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      requirements TEXT NOT NULL,
      about TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS technologies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS job_technologies (
      job_id TEXT NOT NULL,
      technology_id INTEGER NOT NULL,
      PRIMARY KEY (job_id, technology_id),
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_modality ON jobs(modality);
    CREATE INDEX IF NOT EXISTS idx_jobs_level ON jobs(level);
    CREATE INDEX IF NOT EXISTS idx_technologies_name ON technologies(name);
  `)
}

// Las tablas deben existir antes de preparar las consultas.
createTables()

const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (
    id, title, company, location, description, modality, level,
    content_description, responsibilities, requirements, about
  ) VALUES (
    @id, @title, @company, @location, @description, @modality, @level,
    @contentDescription, @responsibilities, @requirements, @about
  )
`)

const insertTechnology = db.prepare(`
  INSERT OR IGNORE INTO technologies (name) VALUES (?)
`)

const getTechnology = db.prepare(`
  SELECT id FROM technologies WHERE name = ?
`)

const insertJobTechnology = db.prepare(`
  INSERT OR IGNORE INTO job_technologies (job_id, technology_id) VALUES (?, ?)
`)

const seed = db.transaction((jobsToInsert: SeedJob[]) => {
    for (const job of jobsToInsert) {
        insertJob.run({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            modality: job.modality,
            level: job.level,
            contentDescription: job.content.description,
            responsibilities: job.content.responsibilities,
            requirements: job.content.requirements,
            about: job.content.about,
        })

        for (const technology of job.technologies) {
            const normalizedTechnology = technology.toLowerCase().trim()
            insertTechnology.run(normalizedTechnology)

            const technologyRow = getTechnology.get(normalizedTechnology) as { id: number } | undefined

            if (!technologyRow) {
                throw new Error(`No se pudo encontrar la tecnología: ${normalizedTechnology}`)
            }

            insertJobTechnology.run(job.id, technologyRow.id)
        }
    }
})

try {
    seed(jobs)
    console.log(`Base de datos inicializada con ${jobs.length} trabajos.`)
} catch (error) {
    console.error('Error al inicializar la base de datos:', error)
    process.exit(1)
} finally {
    db.close()
}