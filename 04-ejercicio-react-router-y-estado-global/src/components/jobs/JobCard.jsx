import { useState } from 'react'
import { Link } from '../Link'
import { useAuthStore } from '../../store/authStore'
import { useFavoritesStore } from '../../store/favoritesStore'

function JobCardFavoriteButton({ jobId }) {
    const { isLoggedIn } = useAuthStore()
    const { toggleFavorite, isFavorite } = useFavoritesStore()

    const favorite = isFavorite(jobId)

    return (
        <button
            onClick={() => toggleFavorite(jobId)}
            disabled={!isLoggedIn}
        >
            {favorite ? '❤️' : '🤍'}
        </button>
    )
}

function JobCardApplyButton() {
    const [aplicado, setAplicado] = useState(false)
    const { isLoggedIn } = useAuthStore()

    const handleAplicar = () => {
        if (!isLoggedIn) return

        setAplicado(true)
    }

    return (
        <button
            className={
                aplicado
                    ? 'button-apply-job is-applied'
                    : 'button-apply-job'
            }
            onClick={handleAplicar}
            disabled={aplicado || !isLoggedIn}
        >
            {aplicado
                ? '¡Aplicado!'
                : isLoggedIn
                    ? 'Aplicar'
                    : 'Inicia sesión para aplicar'
            }
        </button>
    )
}

export function JobCard({ job }) {
    return (
        <article className="job-listing-card">
            <div>
                <h3>{job.titulo}</h3>

                <small>
                    {job.empresa} | {job.ubicacion}
                </small>

                <p>{job.descripcion}</p>
            </div>

            <Link href={`/jobs/${job.id}`}>
                Ver detalles
            </Link>
            <JobCardApplyButton />
            <JobCardFavoriteButton jobId={job.id} />
        </article>
    )
}