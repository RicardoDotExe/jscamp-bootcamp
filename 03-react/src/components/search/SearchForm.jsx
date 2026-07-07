import SearchBar from "./SearchBar"
import SearchFilters from "./SearchFilters"

function SearchForm() {
    return (
        <section className="jobs-search">
            <h1>Encuentra tu próximo trabajo</h1>
            <p>Explora miles de oportunidades en el sector tecnológico</p>
            <form role="search">
                <SearchBar />
                <SearchFilters />
            </form>
        </section>
    )
}

export default SearchForm