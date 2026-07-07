function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handlePrevious = (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange(currentPage - 1) // ← Llamamos a la función del padre
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1) // ← Llamamos a la función del padre
    }
  }

  const handlePageClick = (e, page) => {
    e.preventDefault()
    onPageChange(page) // ← Llamamos a la función del padre
  }

  const styleLinkLeft = {
    opacity: currentPage === 1 ? 0.5 : 1,
    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
  }

  const styleLinkRight = {
    opacity: currentPage === totalPages ? 0.5 : 1,
    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
  }

  return (
    <div>
    <nav className="pagination">
      <a href="#" style={styleLinkLeft} onClick={handlePrevious}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </a>

      {pages.map((page) => (
        <a
          key={page}
          className={currentPage === page ? 'is-active' : ''}
          href="#"
          onClick={(e) => handlePageClick(e, page)}
        >
          {page}
        </a>
      ))}

      <a href="#" style={styleLinkRight} onClick={handleNext}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </a>
    </nav>
    <div className="resultsPerPage">
        <p>Resultados por página:</p>
        <select id="results-per-page" name="results-per-page">
            <option value="5" defaultValue>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
    </div>
    </div>
  )
}

export default Pagination