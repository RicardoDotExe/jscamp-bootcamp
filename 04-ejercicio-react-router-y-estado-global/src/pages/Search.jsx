import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { JobListings } from '../components/jobs/JobListings'
import { Pagination } from '../components/search/Pagination'
import { SearchForm } from '../components/search/SearchForm'
import { Spinner } from '../components/search/Spinner'

const useFilters = () => {
    // La URL es la única fuente de verdad en este ejercicio, vamos a leerlos y manejar los filtros iniciales a partir de aquí
    const [searchParams, setSearchParams] = useSearchParams()

    const textToFilter = searchParams.get('text') ?? ''
    const filters = {
        technology: searchParams.get('technology') ?? '',
        location: searchParams.get('type') ?? '', // la API llama 'type' a la ubicación
        experienceLevel: searchParams.get('level') ?? ''
    }
    const currentPage = Number(searchParams.get('page')) || 1

    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [error, setError] = useState(null)

    const [resultsPerPage, setResultsPerPage] = useState(5)

    // Este helper se encarga de aplicar cambios a los parámetros de la URL y reiniciar la paginación
    const updateParams = (apply) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev)
            apply(params)
            params.delete('page')
            return params
        })
    }

    const handleSearch = (newFilters) => {
        const listOfFilters = [
            ['technology', newFilters.technology],
            ['type', newFilters.location],
            ['level', newFilters.experienceLevel]
        ]

        updateParams((params) => {
            for (const [param, value] of listOfFilters) {
                value
                ? params.set(param, value)
                : params.delete(param)
            }
        })
    }

    const handleTextFilter = (text) => {
        updateParams((params) => {
            text
            ? params.set('text', text)
            : params.delete('text')
        })
    }

    const handleClearFilters = () => {
        setSearchParams({})
    }

    const handlePageChange = (page) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev)
            params.set('page', page)
            return params
        })
    }

    const handleResultsPerPageChange = (value) => {
        setResultsPerPage(value)

        if (searchParams.has('page')) {
            updateParams(() => {}) // al cambiar el tamaño de página volvemos a la página 1
        }
    }

    // Obtener trabajos de la API cuando cambian los parámetros de la URL
    useEffect(() => {
        async function fetchJobs() {
            try {
                setLoading(true)
                setError(null)

                const params = new URLSearchParams(searchParams)
                params.delete('page') // la paginación es solo de la interfaz, la API usa limit/offset

                const offset = (currentPage - 1) * resultsPerPage

                params.append('limit', resultsPerPage)
                params.append('offset', offset)

                const response = await fetch(
                    `https://jscamp-api.vercel.app/api/jobs?${params.toString()}`
                )

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`)
                }

                const json = await response.json()

                setJobs(json.data)
                setTotalJobs(json.total)
            } catch (error) {
                console.error('Error fetching jobs:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [searchParams, currentPage, resultsPerPage])

    const totalPages = Math.ceil(
        totalJobs / resultsPerPage
    )

    const hasActiveFilters =
        Object.values(filters).some(value => value !== '') ||
        textToFilter !== ''

    return {
        loading,
        error,
        jobs,
        totalJobs,
        totalPages,
        currentPage,
        resultsPerPage,
        textToFilter,
        filters,
        hasActiveFilters,
        handleSearch,
        handleTextFilter,
        handleClearFilters,
        handlePageChange,
        handleResultsPerPageChange
    }
}

export default function SearchPage() {
    const {
        loading,
        error,
        jobs,
        totalJobs,
        totalPages,
        currentPage,
        resultsPerPage,
        textToFilter,
        filters,
        hasActiveFilters,
        handleSearch,
        handleTextFilter,
        handleClearFilters,
        handlePageChange,
        handleResultsPerPageChange
    } = useFilters()

    // Título de la pestaña con los resultados y página actual
    useEffect(() => {
        document.title = `Resultados ${totalJobs} | Página ${currentPage} | DevJobs`
    }, [totalJobs, currentPage])

    return (
        <>
            <SearchForm
                initialText={textToFilter}
                filters={filters}
                onSearch={handleSearch}
                onTextFilter={handleTextFilter}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
            />

            <section className="jobs-result">
                {
                    error ? (
                        <div className="error-container">
                            <h2>¡Ups! Algo ha salido mal</h2>
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()}>
                                Reintentar
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="loading-container">
                            <Spinner />
                            <p>Cargando empleos...</p>
                        </div>
                    ) : (
                        <JobListings jobs={jobs} />
                    )
                }

                {/* La paginación se muestra si hay resultados disponibles. */}
                {jobs.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        resultsPerPage={resultsPerPage}
                        onResultsPerPageChange={handleResultsPerPageChange}
                    />
                )}
            </section>
        </>
    )
}
