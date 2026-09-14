import type { ExperienceLevel, Technology } from './types.ts'
import type { Job } from './objects.ts'

// Filtrar por experiencia
export function filterByExperience(jobs: Job[], level: ExperienceLevel): Job[] {
  return jobs.filter((job) => job.experienceLevel === level)
}

// Filtrar por tecnología
export function filterByTechnology(jobs: Job[], tech: Technology): Job[] {
  return jobs.filter((job) => job.technologies.includes(tech.toLowerCase() as Technology))
}

// Filtrar por salario mínimo
export function filterByMinSalary(jobs: Job[], minSalary: number): Job[] {
  return jobs.filter((job) => job.salary !== undefined && job.salary >= minSalary)
}

// Buscar por texto
export function searchJobs(jobs: Job[], searchTerm: string): Job[] {
  const term = searchTerm.toLowerCase()

  return jobs.filter((job) =>
      job.title.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term)
  )
}