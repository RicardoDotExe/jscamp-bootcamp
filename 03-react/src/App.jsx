import jobs from './data/jobsData.json'
import JobCard from './components/jobs/JobCard'
import SearchForm from './components/search/SearchForm'

function App() {

  return (
    <>
        <main>
            <section className="jobs-search">
                <h1>Encuentra tu próximo trabajo</h1>
                <p>Explora miles de oportunidades en el sector tecnológico</p>

                <SearchForm />

                <span id="filter-selected-value"></span>
            </section>

            <section className="jobs-result">
                <h2>Resultados de búsqueda</h2> 
                <div className="jobs-listings">
                     {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
                <div className="resultsPerPage">
                    <p>Resultados por página:</p>
                    <select id="results-per-page" name="results-per-page">
                        <option value="5" defaultValue>5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <nav className="pagination">
                    {/* Los controles de paginación se generarán aquí dinámicamente */}
                </nav>

            </section>
        </main>
    </>
  )
}

export default App
