import { JobCard } from "./JobCard"

export function JobListings({ jobs }) {
  return (
    <div>
    <h2>Resultados de búsqueda</h2> 
      {jobs.length === 0 ? (
        <>
          {/* <p>No hay trabajos disponibles.</p> */}
          {/* Tu mensaje está genial :) Hicimos un cambio para que dar un poco más de detalle al usuario. Son opciones, ninguna está mal, si? */}
          <p>No se han encontrado empleos que coincidan con los criterios de búsqueda</p>
        </>
      ) : (
        <div className="jobs-listings">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

// export default JobListings