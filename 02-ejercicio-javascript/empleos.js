const loading = document.createElement('p');
const jobsListingSection = document.querySelector('.jobs-listings');
loading.textContent = 'Cargando empleos...';
jobsListingSection.appendChild(loading);

// Variables de paginación
let allJobs = [];         // Jobs cargados del JSON
let filteredJobs = [];    // Jobs tras aplicar filtros
let currentPage = 1;
let itemsPerPage = 5;

// --- BOTÓN "APLICAR" ---
jobsListingSection.addEventListener('click', function (event) {
    const element = event.target;

    if (element.classList.contains('button-apply-job')) {
        element.textContent = '¡Aplicado!';
        element.classList.add('is-applied');
        element.disabled = true;
    }
});

// --- FETCH JOBS ---
fetch('./assets/data/jobsData.json')
    .then((response) => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        return response.json();
    })
    .then((jobs) => {
        loading.remove();

        if (!Array.isArray(jobs) || jobs.length === 0) {
            jobsListingSection.innerHTML = '<p>No hay empleos disponibles por ahora.</p>';
            return;
        }

        allJobs = jobs;
        filteredJobs = [...allJobs];

        renderJobs();
        renderPagination();
    })
    .catch((error) => {
        jobsListingSection.innerHTML = '<p>No se pudieron cargar los empleos.</p>';
        console.error('Error:', error);
    });


// --- RENDER DE JOBS SEGÚN PÁGINA ---
function renderJobs() {
    jobsListingSection.innerHTML = ""; //Se limpia el contenedor para re-renderizar los jobs

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const jobsToShow = filteredJobs.slice(start, end);
    if (jobsToShow.length === 0) {
        // Mostrar mensaje si no hay trabajos
        const message = document.createElement('p');
        message.textContent = 'No existen trabajos disponibles con esa combinación de filtros';
        message.className = 'no-items-message';
        jobsListingSection.appendChild(message);
    } else {
        jobsToShow.forEach((job) => {
            const article = document.createElement('article');
            article.className = 'job-listing-card';

            // dataset para filtros
            article.dataset.location = job.data?.location || '';
            article.dataset.nivel = job.data?.nivel || '';
            article.dataset.technology = job.data?.technology?.join(', ') || '';

            article.innerHTML = `
            <div>
                <h3>${job.title}</h3>
                <small>${job.company} | ${job.location}</small>
                <p>${job.description}</p>
            </div>
            <button class="button-apply-job">Aplicar</button>
        `;

            jobsListingSection.appendChild(article);
        });
    }
}


// --- PAGINACIÓN ---
function renderPagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

    // Prev
    const prev = document.createElement('a');
    prev.href = "#";
    prev.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M15 6l-6 6l6 6"/>
        </svg>`;

    if (currentPage > 1) {
        prev.addEventListener('click', () => {
            currentPage--;
            renderJobs();
            renderPagination();
        });
    } else {
        prev.style.opacity = "0.35";
        prev.style.pointerEvents = "none";
    }
    pagination.appendChild(prev);

    // Números
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('a');
        btn.href = "#";
        btn.textContent = i;

        if (i === currentPage) {
            btn.classList.add('is-active');
        }

        btn.addEventListener('click', () => {
            currentPage = i;
            renderJobs();
            renderPagination();
        });

        pagination.appendChild(btn);
    }

    // Next
    const next = document.createElement('a');
    next.href = "#";
    next.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 6l6 6l-6 6"/>
        </svg>`;

    if (currentPage < totalPages) {
        next.addEventListener('click', () => {
            currentPage++;
            renderJobs();
            renderPagination();
        });
    } else {
        next.style.opacity = "0.35";
        next.style.pointerEvents = "none";
    }

    pagination.appendChild(next);
}


// --- FILTROS ---
const filterLocation = document.querySelector('#filter-location');
const filterTechnology = document.querySelector('#filter-technology');
const filterNivel = document.querySelector('#filter-experience-level');

function applyFilters() {
    const selectedLocation = filterLocation.value;
    const selectedTech = filterTechnology.value;
    const selectedLevel = filterNivel.value;

    filteredJobs = allJobs.filter(job => {
        const jobLocation = job.data?.location || "";
        const jobTech = job.data?.technology?.join(', ') || "";
        const jobLevel = job.data?.nivel || "";

        const matchesLocation =
            selectedLocation === "" || selectedLocation === jobLocation;

        const matchesTech =
            selectedTech === "" || jobTech.includes(selectedTech);

        const matchesLevel =
            selectedLevel === "" || selectedLevel === jobLevel;

        return matchesLocation && matchesTech && matchesLevel;
    });

    currentPage = 1; // Siempre volver a la página 1 tras filtrar
    renderJobs();
    renderPagination();
}

filterLocation.addEventListener('change', applyFilters);
filterTechnology.addEventListener('change', applyFilters);
filterNivel.addEventListener('change', applyFilters);

// --- PAGINACION ---
const filterResultsPerPage = document.querySelector('#results-per-page');

filterResultsPerPage.addEventListener('change', () => {
    itemsPerPage = parseInt(filterResultsPerPage.value, 10);
    currentPage = 1;
    renderJobs();
    renderPagination();
});