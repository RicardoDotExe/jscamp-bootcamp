// --- VARIABLES GLOBALES ---
const jobsListingSection = document.querySelector('.jobs-listings');
const loading = document.createElement('p');
loading.textContent = 'Cargando empleos...';
jobsListingSection.appendChild(loading);

let allJobs = [];         // Jobs cargados del JSON
let filteredJobs = [];    // Jobs tras aplicar filtros
let currentPage = 1;
let itemsPerPage = 5;

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
