const paginationContainer = document.querySelector('.pagination');
const resultsPerPageSelect = document.querySelector('#results-per-page');

let currentPage = 1;
let itemsPerPage = 5;

export function renderPagination() {
    if (!paginationContainer) return;

    // Obtenemos los que NO están ocultos por el filtro de búsqueda.
    // Con esto calculamos cuánta paginación habrá.
    const visibleJobs = Array.from(document.querySelectorAll('.job-listing-card'))
        .filter(job => !job.classList.contains('is-hidden'));

    const totalPages = Math.ceil(visibleJobs.length / itemsPerPage);

    if (currentPage > totalPages) currentPage = 1;

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) {
        showJobsPage(visibleJobs);
        return;
    }

    // --- Botones ---
    const prev = document.createElement('a');
    prev.href = "#";
    prev.textContent = "«";
    if (currentPage > 1) {
        prev.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            renderPagination();
        });
    } else {
        prev.style.opacity = "0.35";
        prev.style.pointerEvents = "none";
    }
    paginationContainer.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('a');
        btn.href = "#";
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('is-active');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderPagination();
        });
        paginationContainer.appendChild(btn);
    }

    const next = document.createElement('a');
    next.href = "#";
    next.textContent = "»";
    if (currentPage < totalPages) {
        next.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            renderPagination();
        });
    } else {
        next.style.opacity = "0.35";
        next.style.pointerEvents = "none";
    }
    paginationContainer.appendChild(next);

    showJobsPage(visibleJobs);
}

function showJobsPage(visibleJobs) {
    // Primero ocultamos todas las cards de la vista
    const allCards = document.querySelectorAll('.job-listing-card');
    allCards.forEach(card => card.style.display = 'none');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Mostramos solo las que tocan en esta página
    visibleJobs.forEach((job, index) => {
        if (index >= start && index < end) {
            job.style.display = 'flex'; 
        }
    });
}

if (resultsPerPageSelect) {
    resultsPerPageSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value, 10);
        currentPage = 1;
        renderPagination();
    });
}