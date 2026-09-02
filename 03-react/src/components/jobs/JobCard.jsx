import { useState } from 'react'

export function JobCard({ job }) {
    const [aplicado, setAplicado] = useState(false)

    const handleAplicar = () => {
        setAplicado(true)
    }

    return (
        <article className="job-listing-card">
            <div>
                <h3>{job.titulo}</h3>
                <small>{job.empresa} | {job.ubicacion}</small>
                <p>{job.descripcion}</p>
            </div>

            <button
                className={
                    aplicado
                        ? 'button-apply-job is-applied'
                        : 'button-apply-job'
                }
                onClick={handleAplicar}
                disabled={aplicado}
            >
                {aplicado ? '¡Aplicado!' : 'Aplicar'}
            </button>
        </article>
    )
}

// export default JobCard