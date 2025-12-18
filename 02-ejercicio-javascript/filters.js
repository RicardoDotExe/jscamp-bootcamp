// --- FILTROS ---
const filterLocation = document.querySelector('#filter-location');
const filterTechnology = document.querySelector('#filter-technology');
const filterNivel = document.querySelector('#filter-experience-level');
const jobsListingSection = document.querySelector('.jobs-listings');

function applyFilters() {
    const selectedLocation = filterLocation.value;
    const selectedTech = filterTechnology.value;
    const selectedLevel = filterNivel.value;

    // Seleccionamos todos los jobs ya renderizados
    const jobs = jobsListingSection.querySelectorAll('.job-listing-card');

    jobs.forEach(job => {
        const jobLocation = job.dataset.location || "";
        const jobTech = job.dataset.technology || "";
        const jobLevel = job.dataset.nivel || "";

        const matchesLocation = selectedLocation === "" || selectedLocation === jobLocation;
        const matchesTech = selectedTech === "" || jobTech.includes(selectedTech);
        const matchesLevel = selectedLevel === "" || selectedLevel === jobLevel;

        const isShown = matchesLocation && matchesTech && matchesLevel;

        // Añade o quita la clase is-hidden según corresponda
        job.classList.toggle('is-hidden', !isShown);
    });
}

filterLocation.addEventListener('change', applyFilters);
filterTechnology.addEventListener('change', applyFilters);
filterNivel.addEventListener('change', applyFilters);
