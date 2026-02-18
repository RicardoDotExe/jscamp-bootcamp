import jobs from './data/jobsData.json'
import JobCard from './components/JobCard'

function App() {

  return (
    <>
        <main>
            <section className="jobs-search">
                <h1>Encuentra tu próximo trabajo</h1>
                <p>Explora miles de oportunidades en el sector tecnológico</p>

                <form role="search">
                    <div className="search-bar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1"
                            strokeLinecap="round" strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                        </svg>
                        <input id="empleos-search-input" name="search"
                            type="text"
                            placeholder="Buscar trabajos, empresas o habilidades"/>
                    </div>
                    <div className="search-filters">
                        <select name="technology" id="filter-technology">
                            <option value>Tecnología</option>

                            <optgroup label="Tecnologías Frontend">
                                <option value="javascript">JavaScript</option>
                                <option value="react">React</option>
                                <option value="angular">Angular</option>
                            </optgroup>

                            <optgroup label="Tecnologías Backend">
                                <option value="nodejs">Node.js</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="csharp">C#</option>
                                <option value="c">C</option>
                                <option value="c++">C++</option>
                                <option value="ruby">Ruby</option>
                                <option value="php">PHP</option>
                            </optgroup>
                        </select>

                        <select name="location" id="filter-location">
                            <option value>Ubicación</option>
                            <option value="remoto">Remoto</option>
                            <option value="cdmx">Ciudad de México</option>
                            <option value="guadalajara">Guadalajara</option>
                            <option value="monterrey">Monterrey</option>
                            <option value="barcelona">Barcelona</option>
                            <option value="madrid">Madrid</option>
                            <option value="ba">Buenos Aires</option>
                        </select>

                        <select name="experience-level"
                            id="filter-experience-level">
                            <option value>Nivel de experiencia</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-level</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead</option>
                        </select>
                    </div>
                </form>

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
