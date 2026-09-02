import { useId, useRef, useState } from 'react'
import SearchBar from './SearchBar'
import SearchFilters from './SearchFilters'

const useSearchForm = ({
    idTechnology,
    idLocation,
    idExperienceLevel,
    idText,
    initialText,
    onSearch,
    onTextFilter,
    onClearFilters
}) => {
    const timeoutId = useRef(null)

    const [searchText, setSearchText] = useState(initialText)

    const handleFiltersChange = (event) => {
        if (event.target.name === idText) {
            return
        }

        const formData = new FormData(event.currentTarget)

        const newFilters = {
            technology: formData.get(idTechnology),
            location: formData.get(idLocation),
            experienceLevel: formData.get(idExperienceLevel)
        }

        onSearch(newFilters)
    }

    const handleClearFilters = () => {
        setSearchText('')

        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }

        onClearFilters()
    }

    const handleTextChange = (text) => {
        setSearchText(text)

        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }

        timeoutId.current = setTimeout(() => {
            onTextFilter(text)
        }, 500)
    }

    return {
        searchText,
        handleClearFilters,
        handleFiltersChange,
        handleTextChange
    }
}

function SearchForm({
    initialText,
    filters,
    onSearch,
    onTextFilter,
    hasActiveFilters,
    onClearFilters
}) {
    const idTechnology = useId()
    const idLocation = useId()
    const idExperienceLevel = useId()
    const idText = useId()

    const {
        searchText,
        handleClearFilters,
        handleFiltersChange,
        handleTextChange
    } = useSearchForm({
        idTechnology,
        idLocation,
        idExperienceLevel,
        idText,
        initialText,
        onSearch,
        onTextFilter,
        onClearFilters
    })

    return (
        <section className="jobs-search">
            <h1>Encuentra tu próximo trabajo</h1>

            <p>
                Explora miles de oportunidades
                en el sector tecnológico
            </p>

            <form
                role="search"
                onChange={handleFiltersChange}
            >
                <SearchBar
                    idText={idText}
                    currentText={searchText}
                    onTextChange={handleTextChange}
                />

                <SearchFilters
                    idTechnology={idTechnology}
                    idLocation={idLocation}
                    idExperienceLevel={idExperienceLevel}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                />

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                    >
                        Limpiar filtros
                    </button>
                )}
            </form>
        </section>
    )
}

export default SearchForm