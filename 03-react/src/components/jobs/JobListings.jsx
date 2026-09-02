import JobCard from "./JobCard"

export function JobListings({ jobs }) {
  return (
    <div>
    <h2>Resultados de búsqueda</h2> 
      {jobs.length === 0 ? (
        <p>No hay trabajos disponibles.</p>
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

export default JobListings