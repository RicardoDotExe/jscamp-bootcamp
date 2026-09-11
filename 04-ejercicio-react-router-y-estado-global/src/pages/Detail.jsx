import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { Link } from '../components/Link'
import styles from './Detail.module.css'
import { useAuthStore } from '../store/authStore'
import { useFavoritesStore } from '../store/favoritesStore'

function JobSection({ title, content }) {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
                {title}
            </h2>

            <div className={styles.sectionContent}>
                {content}
            </div>
        </section>
    )
}

function DetailPageBreadCrumb({ job }) {
    return (
        <nav className={styles.breadcrumb}>
            <Link
                href="/search"
                className={styles.breadcrumbButton}
            >
                Empleos
            </Link>

            <span className={styles.breadcrumbSeparator}>
                /
            </span>

            <span className={styles.breadcrumbCurrent}>
                {job.titulo}
            </span>
        </nav>
    )
}

function DetailApplyButton () {
    const { isLoggedIn } = useAuthStore()

    return (
        <button disabled={ !isLoggedIn } className={styles.applyButton}>
            {isLoggedIn ? "Aplicar Ahora" : "Inicia sesión para aplicar"}
        </button>
    )
}

function DetailFavoriteButton ({jobId}) {
    const { isFavorite, toggleFavorite } = useFavoritesStore()

    return (
        <button
        onClick={() => toggleFavorite(jobId)}
        aria-label={isFavorite(jobId) ? 'Eliminar favorito' : 'Añadir favorito'}>
            {isFavorite(jobId) ? '❤️' : '🤍'}
        </button>
    )
}

function DetailPageHeader({ job }) {
    const navigate = useNavigate()

    return (
        <header className={styles.header}>
            <div className={styles.headerInfo}>
                <span className={styles.label}>
                    Oferta de empleo
                </span>

                <h1 className={styles.title}>
                    {job.titulo}
                </h1>

                <p className={styles.meta}>
                    <strong>{job.empresa}</strong>
                    <span>·</span>
                    <span>{job.ubicacion}</span>
                </p>
            </div>


                <DetailApplyButton/>
                <DetailFavoriteButton jobId={job.id}/>
            {/*<button
                className={styles.backButton}
                onClick={() => navigate('/search')}
            >
                ← Volver a empleos
            </button>*/}
        </header>
    )
}

export default function JobDetail() {
    const { jobId } = useParams()
    const navigate = useNavigate()

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Oferta no encontrada')
                }

                return response.json()
            })
            .then(json => {
                setJob(json)
            })
            .catch(error => {
                setError(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [jobId])

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>
                        Cargando oferta...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <div className={styles.errorIcon}>
                        !
                    </div>

                    <h2 className={styles.errorTitle}>
                        Oferta no encontrada
                    </h2>

                    <p className={styles.errorText}>
                        {error}
                    </p>

                    <button
                        className={styles.errorButton}
                        onClick={() => navigate('/')}
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <DetailPageBreadCrumb job={job} />

            <div className={styles.card}>
                <DetailPageHeader job={job} />

                <div className={styles.content}>
                    <JobSection
                        title="Descripción del puesto"
                        content={job.content.description}
                    />

                    <JobSection
                        title="Responsabilidades"
                        content={job.content.responsibilities}
                    />

                    <JobSection
                        title="Requisitos"
                        content={job.content.requirements}
                    />

                    <JobSection
                        title="Acerca de la empresa"
                        content={job.content.about}
                    />
                </div>
            </div>
        </div>
    )
}