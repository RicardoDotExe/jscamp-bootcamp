// --- PAGINACIÓN ---
const pagination = document.querySelector('.pagination');
let currentPage = 1;
let itemsPerPage = 5; // Puedes cambiar dinámicamente desde filters.js o un select

function renderPagination() {
    if (!pagination) return;

    // Todos los jobs visibles
    const jobs = Array.from(document.querySelectorAll('.job-listing-card'))
        .filter(job => !job.classList.contains('is-hidden'));

    const totalPages = Math.ceil(jobs.length / itemsPerPage);

    pagination.innerHTML = "";

    // --- Botón Prev ---
    const prev = document.createElement('a');
    prev.href = "#";
    prev.textContent = "«";
    if (currentPage > 1) {
        prev.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            showJobsPage(jobs);
            renderPagination();
        });
    } else {
        prev.style.opacity = "0.35";
        prev.style.pointerEvents = "none";
    }
    pagination.appendChild(prev);

    // --- Botones de página ---
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('a');
        btn.href = "#";
        btn.textContent = i;

        if (i === currentPage) btn.classList.add('is-active');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            showJobsPage(jobs);
            renderPagination();
        });

        pagination.appendChild(btn);
    }

    // --- Botón Next ---
    const next = document.createElement('a');
    next.href = "#";
    next.textContent = "»";
    if (currentPage < totalPages) {
        next.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            showJobsPage(jobs);
            renderPagination();
        });
    } else {
        next.style.opacity = "0.35";
        next.style.pointerEvents = "none";
    }
    pagination.appendChild(next);

    // Mostrar la página actual al renderizar
    showJobsPage(jobs);
}

// --- Mostrar solo los jobs de la página actual ---
function showJobsPage(jobs) {
    jobs.forEach((job, index) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        if (index >= start && index < end) {
            job.classList.remove('is-hidden-page');
        } else {
            job.classList.add('is-hidden-page');
        }
    });
}