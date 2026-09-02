import { useState, useEffect } from 'react'
import { useRouter } from '../hooks/useRouter'
import Spinner from '../components/search/Spinner'
import JobListings from '../components/jobs/JobListings'
import Pagination from '../components/search/Pagination'
import SearchForm from '../components/search/SearchForm'

const EMPTY_FILTERS = {
    technology: '',
    location: '',
    experienceLevel: ''
}

const useFilters = () => {
    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [error, setError] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)

    const [textToFilter, setTextToFilter] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('text') || ''
    })

    const [filters, setFilters] = useState(() => {
        const savedFilters = localStorage.getItem('jobFilters')

        if (savedFilters) {
            try {
                return JSON.parse(savedFilters)
            } catch (error) {
                console.error('Error al leer los filtros:', error)
            }
        }

        return EMPTY_FILTERS
    })

    const [resultsPerPage, setResultsPerPage] = useState(5)

    const handleSearch = (newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handleTextFilter = (text) => {
        setTextToFilter(text)
        setCurrentPage(1)
    }

    // Guardar filtros en localStorage
    useEffect(() => {
        try {
            localStorage.setItem(
                'jobFilters',
                JSON.stringify(filters)
            )
        } catch (error) {
            console.error('Error al guardar los filtros:', error)
        }
    }, [filters])

    // Obtener trabajos de la API
    useEffect(() => {
        async function fetchJobs() {
            try {
                setLoading(true)
                setError(null)

                const params = new URLSearchParams()

                if (textToFilter) {
                    params.append('text', textToFilter)
                }

                if (filters.technology) {
                    params.append('technology', filters.technology)
                }

                if (filters.location) {
                    params.append('type', filters.location)
                }

                if (filters.experienceLevel) {
                    params.append('level', filters.experienceLevel)
                }

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
    }, [filters, currentPage, textToFilter, resultsPerPage])

    const { navigateTo } = useRouter()

    // Actualizar la URL
    useEffect(() => {
        const params = new URLSearchParams()

        if (textToFilter) {
            params.append('text', textToFilter)
        }

        if (filters.technology) {
            params.append('technology', filters.technology)
        }

        if (filters.location) {
            params.append('type', filters.location)
        }

        if (filters.experienceLevel) {
            params.append('level', filters.experienceLevel)
        }

        if (currentPage > 1) {
            params.append('page', currentPage)
        }

        const newUrl = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname

        navigateTo(newUrl)
    }, [filters, currentPage, textToFilter, navigateTo])

    const totalPages = Math.ceil(
        totalJobs / resultsPerPage
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleResultsPerPageChange = (value) => {
        setResultsPerPage(value)
        setCurrentPage(1)
    }

    const hasActiveFilters =
        Object.values(filters).some(value => value !== '') ||
        textToFilter !== ''

    const handleClearFilters = () => {
        setFilters(EMPTY_FILTERS)
        setTextToFilter('')
        setCurrentPage(1)

        localStorage.removeItem('jobFilters')
    }

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

export function SearchPage() {
    const {
        loading,
        error,
        jobs,
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

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    resultsPerPage={resultsPerPage}
                    onResultsPerPageChange={handleResultsPerPageChange}
                />
            </section>
        </>
    )
}