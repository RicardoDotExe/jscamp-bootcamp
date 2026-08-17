import SearchBar from "./SearchBar"
import SearchFilters from "./SearchFilters"

function SearchForm({ currentText, onTextChange, selectedTechnology, onTechnologyChange, selectedLocation, onLocationChange, selectedExperienceLevel, onExperienceLevelChange }) {

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <section className="jobs-search">
            <h1>Encuentra tu próximo trabajo</h1>
            <p>Explora miles de oportunidades en el sector tecnológico</p>
            <form role="search" onSubmit={handleSubmit}>
                <SearchBar
                    currentText={currentText}
                    onTextChange={onTextChange} />
                <SearchFilters
                    selectedTechnology={selectedTechnology}
                    onTechnologyChange={onTechnologyChange}
                    selectedLocation={selectedLocation}
                    onLocationChange={onLocationChange}
                    selectedExperienceLevel={selectedExperienceLevel}
                    onExperienceLevelChange={onExperienceLevelChange} />
            </form>
        </section>
    )
}

export default SearchForm