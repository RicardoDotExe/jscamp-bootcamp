import { useState } from 'react'

function JobCard({ job }) {
  const [aplicado, setAplicado] = useState(false)

  const handleAplicar = () => {
    setAplicado(true)
  }

  return (
    <article className="job-listing-card">
      <div>
        <h3>{job.title}</h3>
        <small>{job.company} | {job.location}</small>
        <p>{job.description}</p>
      </div>
       <button
        className={aplicado ? 'button-apply-job is-applied' : 'button-apply-job'}
        onClick={handleAplicar}
        disabled={aplicado}
      >
        {aplicado ? '¡Aplicado!' : 'Aplicar'}
      </button>
    </article>
  )
}

export default JobCard