import { useState } from 'react'
import jobs from './data/jobsData.json'
import JobCard from './components/jobs/JobCard'
import JobListings from './components/jobs/JobListings'
import Pagination from './components/search/Pagination'
import SearchForm from './components/search/SearchForm'

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = jobs.length / 5

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
        <main>
            <SearchForm />

            <section className="jobs-result">
                <JobListings jobs= {jobs}/>
                <Pagination currentPage={currentPage} totalPages={totalPages} />

            </section>
        </main>
    </>
  )
}

export default App
