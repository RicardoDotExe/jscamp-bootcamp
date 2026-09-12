import express from 'express'
import { readFileSync } from 'node:fs'
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT ?? 1234
const app = express()

app.use(express.json())

const jobs = JSON.parse(readFileSync('./jobs.json', 'utf-8'))

app.use((request, response, next) => {
    const timeString = new Date().toLocaleTimeString()
    console.log(`[${timeString}] ${request.method} ${request.url}`)
    next()
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/health', (request, response) => {
    return response.json({
        status: 'ok',
        uptime: process.uptime()
    })
})

// CRUD: CREATE, READ, UPDATE, DELETE

app.get('/jobs', (req, res) => {
    const {
        text,
        title,
        level,
        limit = DEFAULTS.LIMIT_PAGINATION,
        technology,
        offset = DEFAULTS.LIMIT_OFFSET
    } = req.query

    let filteredJobs = jobs

    // Filtro por texto libre
    if (text) {
        const searchTerm = text.toLowerCase()

        filteredJobs = filteredJobs.filter(job =>
            job.titulo.toLowerCase().includes(searchTerm) ||
            job.descripcion.toLowerCase().includes(searchTerm)
        )
    }

    // Filtro por título
    if (title) {
        const titleSearch = title.toLowerCase()

        filteredJobs = filteredJobs.filter(job =>
            job.titulo.toLowerCase().includes(titleSearch)
        )
    }

    // Filtro por nivel
    if (level) {
        const levelSearch = level.toLowerCase()

        filteredJobs = filteredJobs.filter(job =>
            job.data.nivel.toLowerCase() === levelSearch
        )
    }

    // Filtro por tecnología
    if (technology) {
        const technologySearch = technology.toLowerCase()

        filteredJobs = filteredJobs.filter(job =>
            job.data.technology.some(tech =>
                tech.toLowerCase() === technologySearch
            )
        )
    }

    // Paginación
    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)

    const paginatedJobs = filteredJobs.slice(
        offsetNumber,
        offsetNumber + limitNumber
    )

    return res.json(paginatedJobs)
})

app.get('/jobs/:id', (req, res) => {
    const { id } = req.params
    const idNumber = Number(id)

    const job = jobs.find(job => job.id === id)

    if (!job) {
        return res.status(404).json({ error: 'Job not found'})
    }

    return res.json(job)
})

app.post('/jobs', (req, res) => {
    const { titulo, empresa, ubicacion, data } = req.body
    const newJob = {
        id: crypto.randomUUID(),
        titulo,
        empresa,
        ubicacion,
        data
    }

    jobs.push(newJob)

    return res.status(201).json(newJob)
})

// Reemplazar un recurso completo
app.put('/jobs/:id', (req, res) => {
    //TODO
})

// Actualizar parcialmente un recurso
app.patch('/jobs/:id', (req, res) => {
    //TODO
})

app.delete('/jobs/:id', (req, res) => {
    //TODO
})

app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`)
})