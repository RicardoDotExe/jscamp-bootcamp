import SearchBar from "./SearchBar"
import SearchFilters from "./SearchFilters"

function SearchForm() {
    return (
        <form role="search">
            <SearchBar />
            <SearchFilters />
        </form>
    )
}

export default SearchForm