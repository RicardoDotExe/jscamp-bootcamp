import { renderPagination } from './pagination.js';

const filterLocation = document.querySelector('#filter-location');
const filterTechnology = document.querySelector('#filter-technology');
const filterNivel = document.querySelector('#filter-experience-level');
const filterSearch = document.querySelector('#empleos-search-input');

export function applyFilters() {
    const selectedLocation = filterLocation.value.toLowerCase().trim();
    const selectedTech = filterTechnology.value.toLowerCase().trim();
    const selectedLevel = filterNivel.value.toLowerCase().trim();
    const selectedSearch = filterSearch.value.toLowerCase().trim();

    const jobs = document.querySelectorAll('.job-listing-card');

    jobs.forEach(job => {
        const jobLocation = (job.dataset.location || "").toLowerCase();
        const jobTech = (job.dataset.technology || "").toLowerCase();
        const jobLevel = (job.dataset.nivel || "").toLowerCase();
        const jobSearch = job.querySelector('h3').textContent.toLowerCase();

        const matchesLocation = selectedLocation === "" || jobLocation === selectedLocation;
        const matchesTech = selectedTech === "" || jobTech.includes(selectedTech);
        const matchesLevel = selectedLevel === "" || jobLevel === selectedLevel;
        const matchesSearch = selectedSearch === "" || jobSearch.includes(selectedSearch);

        if (matchesLocation && matchesTech && matchesLevel && matchesSearch) {
            job.classList.remove('is-hidden');
        } else {
            job.classList.add('is-hidden');
        }
    });

    //Se re-renderiza la paginación 
    renderPagination();
}

filterLocation.addEventListener('change', applyFilters);
filterTechnology.addEventListener('change', applyFilters);
filterNivel.addEventListener('change', applyFilters);
filterSearch.addEventListener('input', applyFilters);

window.addEventListener('jobsLoaded', applyFilters);