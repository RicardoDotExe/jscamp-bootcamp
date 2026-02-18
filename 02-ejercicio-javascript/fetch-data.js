import { renderPagination } from './pagination.js';
// --- VARIABLES GLOBALES ---
const jobsListingSection = document.querySelector('.jobs-listings');
const loading = document.createElement('p');
loading.textContent = 'Cargando empleos...';
jobsListingSection.appendChild(loading);

export let allJobs = [];

// --- FETCH JOBS ---
fetch('./assets/data/jobsData.json')
    .then((response) => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        return response.json();
    })
    .then((jobs) => {
        loading.remove();
        if (!Array.isArray(jobs) || jobs.length === 0) {
            jobsListingSection.innerHTML = '<p>No hay empleos disponibles.</p>';
            return;
        }
        allJobs = jobs;
        renderJobs(); // Pintamos TODO el DOM una sola vez
        renderPagination();
        
        // Disparamos un evento personalizado para que filters.js sepa que ya puede actuar
        window.dispatchEvent(new Event('jobsLoaded'));
    })
    .catch((error) => {
        jobsListingSection.innerHTML = '<p>No se pudieron cargar los empleos.</p>';
        console.error('Error:', error);
    });

export function renderJobs() {
    jobsListingSection.innerHTML = ""; 

    allJobs.forEach((job) => {
        const article = document.createElement('article');
        article.className = 'job-listing-card';

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