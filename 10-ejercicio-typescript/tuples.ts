import type { Job } from './objects.ts'

// Tupla para coordenadas de ubicación
export type Coordinates = [number, number] // [latitud, longitud]

// Tupla para rango de salario
export type SalaryRange = [number, number] // [mínimo, máximo]

// Función que devuelve el rango de salarios
export function getSalaryRange(
  jobs: Job[]
): SalaryRange {
  const salaries: number[] = jobs
    .filter((job): job is Job & { salary: number } => job.salary !== undefined)
    .map((job) => job.salary)

  if (salaries.length === 0) {
    return [0, 0]
  }

  const min = Math.min(...salaries)
  const max = Math.max(...salaries)

  return [min, max]
}