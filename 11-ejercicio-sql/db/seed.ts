import crypto from 'node:crypto'
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

// IF NOT EXISTS evita recrearlas si ya existen.
function createTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
      level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
    );

    CREATE TABLE IF NOT EXISTS job_technologies (
      job_id TEXT NOT NULL,
      technology TEXT NOT NULL,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS job_content (
      job_id TEXT NOT NULL,
      description TEXT NOT NULL,
      id TEXT PRIMARY KEY,
      responsibilities TEXT NOT NULL,
      requirements TEXT NOT NULL,
      about TEXT NOT NULL,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_modality ON jobs(modality);
    CREATE INDEX IF NOT EXISTS idx_jobs_level ON jobs(level);
    CREATE INDEX IF NOT EXISTS idx_job_technologies_job_id ON job_technologies(job_id);
  `)
}

// Las tablas deben existir antes de preparar las consultas.
createTables()

const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (@id, @title, @company, @location, @description, @modality, @level)
`)

// El content va en su propia tabla y necesita su propio id (es su PRIMARY KEY).
const insertContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (@id, @jobId, @description, @responsibilities, @requirements, @about)
`)

const insertTechnology = db.prepare(`
  INSERT INTO job_technologies (job_id, technology) VALUES (@jobId, @technology)
`)

const seed = db.transaction((jobsToInsert: SeedJob[]) => {
    // Vaciamos para poder re-ejecutar el seed sin duplicar, el ON DELETE CASCADE borra también las tablas hijas.
    db.prepare('DELETE FROM jobs').run()

    for (const job of jobsToInsert) {
        insertJob.run({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            modality: job.modality,
            level: job.level,
        })

        insertContent.run({
            id: crypto.randomUUID(),
            jobId: job.id,
            description: job.content.description,
            responsibilities: job.content.responsibilities,
            requirements: job.content.requirements,
            about: job.content.about,
        })

        for (const technology of job.technologies) {
            insertTechnology.run({ jobId: job.id, technology: technology.toLowerCase().trim() })
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