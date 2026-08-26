import { useState } from 'react'
import jobs from '../data/jobsData.json'
import JobCard from '../components/jobs/JobCard'
import JobListings from '../components/jobs/JobListings'
import Pagination from '../components/search/Pagination'
import SearchForm from '../components/search/SearchForm'

export function SearchPage() {

    const [currentPage, setCurrentPage] = useState(1)

    const searchParams = new URLSearchParams(window.location.search)
    const initialText = searchParams.get('text') ?? ''

    const [currentText, setCurrentText] = useState(initialText)
    const [selectedTechnology, setSelectedTechnology] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('')

    const handleTextChange = (text) => {
        setCurrentText(text)
    }

    const handleTechnologyChange = (value) => {
        setSelectedTechnology(value)
    }

    const handleLocationChange = (value) => {
        setSelectedLocation(value)
    }

    const handleExperienceLevelChange = (value) => {
        setSelectedExperienceLevel(value)
    }


    const filteredJobs = jobs.filter(job => {
        const matchesText = job.title.toLowerCase().includes(currentText.toLowerCase())
        const matchesTechnology = selectedTechnology === '' || job.data.technology.includes(selectedTechnology)
        const matchesLocation = selectedLocation === '' || job.data.location === selectedLocation
        const matchesLevel = selectedExperienceLevel === '' || job.data.nivel === selectedExperienceLevel

        return matchesText && matchesTechnology && matchesLocation && matchesLevel
    })


    const [resultsPerPage, setResultsPerPage] = useState(5)
    const totalPages = Math.ceil(filteredJobs.length / resultsPerPage)
    const startIndex = (currentPage - 1) * resultsPerPage
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + resultsPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleResultsPerPageChange = (value) => {
        setResultsPerPage(value)
        setCurrentPage(1)
    }

    return (
        <>
            <SearchForm
                currentText={currentText}
                onTextChange={handleTextChange}
                selectedTechnology={selectedTechnology}
                onTechnologyChange={handleTechnologyChange}
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
                selectedExperienceLevel={selectedExperienceLevel}
                onExperienceLevelChange={handleExperienceLevelChange}
            />

            <section className="jobs-result">
                <JobListings jobs={paginatedJobs} />
                <Pagination currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    resultsPerPage={resultsPerPage}
                    onResultsPerPageChange={handleResultsPerPageChange} />
            </section>
        </>
    )

}
