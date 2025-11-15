const container = document.querySelector('.jobs-listings')
const loading = document.createElement('p')
const jobsListingSection = document.querySelector('.jobs-listings')
loading.textContent = 'Cargando empleos...'
container.appendChild(loading)

//apply button 
jobsListingSection.addEventListener('click', function (event) {
    const element = event.target

    if (element.classList.contains('button-apply-job')) {
        element.textContent = '¡Aplicado!'
        element.classList.add('is-applied')
        element.disabled = true
    }
})

// fetch de datos de empleos
fetch('./assets/data/jobsData.json')
    .then((response) => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON')
        return response.json()
    })
    .then((jobs) => {
        loading.remove()

        if (!Array.isArray(jobs) || jobs.length === 0) {
            container.innerHTML = '<p>No hay empleos disponibles por ahora.</p>'
            return
        }

        jobs.forEach((job) => {
            const article = document.createElement('article')
            article.className = 'job-listing-card'

            // asignar dataset
            article.dataset.location = job.data?.location || ''
            article.dataset.nivel = job.data?.nivel || ''
            article.dataset.technology = job.data?.technology?.join(', ') || ''

            // render del contenido
            article.innerHTML = `
                <div>
                    <h3>${job.title}</h3>
                    <small>${job.company} | ${job.location}</small>
                    <p>${job.description}</p>
                </div>
                <button class="button-apply-job">Aplicar</button>
            `

            container.appendChild(article)
        })
    })
    .catch((error) => {
        container.innerHTML = '<p>No se pudieron cargar los empleos.</p>'
        console.error('Error:', error)
    })

//Filtrado de empleos
const filter = document.querySelector('#filter-location')
const mensaje = document.querySelector('#filter-selected-value')
filter.addEventListener('change', function () {
    const jobs = document.querySelectorAll('.job-listing-card')
    const selectedValue = filter.value

    jobs.forEach((job) => {
        const localidad = job.getAttribute('data-location')
        const isShown = selectedValue === '' || selectedValue === localidad
        job.classList.toggle('is-hidden', isShown === false)
    })
})
