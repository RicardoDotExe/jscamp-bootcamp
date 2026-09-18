import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { json } from 'node:stream/consumers'

process.loadEnvFile()
const port = process.env.PORT ?? 3000

function sendJson(res, statusCode, data) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(data))
}

const users = [
    { id: 1, name: 'midudev' },
    { id: 2, name: 'rikinillo' },
]

const server = createServer(async(req, res) => {

    const { method, url } = req

    const [ pathName, queryString ] = url.split('?')
    const searchParams = new URLSearchParams(queryString)

    /* Esta validación se ejecutaba para TODAS las rutas, la movimos dentro del GET /users
    if (Number.isNaN(Number(searchParams.get('limit')) ||
            Number(searchParams.get('offset')))) {
            return sendJson(res, 400, { error: 'limit y offset deben de ser numeros'})
            }
    */

    if (method === 'GET') {
        if (pathName === '/health') {
            return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
        }

        if (pathName === '/users') {
            /* Esto paginaba siempre y no implementaba los filtros por nombre ni por rango de edad
            const limit = Number(searchParams.get('limit')) || users.length
            const offset = Number(searchParams.get('offset')) || 0
            const paginatedUsers = users.slice(offset, offset + limit)

            return sendJson(res, 200, paginatedUsers)
            */

            const limitParam = searchParams.get('limit')
            const offsetParam = searchParams.get('offset')

            // Validamos limit/offset solo si el usuario los pasó y solo en esta ruta
            if ((limitParam && Number.isNaN(Number(limitParam))) ||
                (offsetParam && Number.isNaN(Number(offsetParam)))) {
                return sendJson(res, 400, { error: 'limit y offset deben ser números' })
            }

            let filtered = users

            // Filtramos por nombre sin distinguir mayúsculas
            if (searchParams.has('name')) {
                const name = searchParams.get('name').toLowerCase()
                filtered = filtered.filter((user) => user.name.toLowerCase().includes(name))
            }

            // Filtramos por rango de edad, cada límite es independiente
            const minAge = Number(searchParams.get('minAge'))
            const maxAge = Number(searchParams.get('maxAge'))
            if (searchParams.has('minAge')) filtered = filtered.filter((user) => user.age >= minAge)
            if (searchParams.has('maxAge')) filtered = filtered.filter((user) => user.age <= maxAge)

            // Paginamos solo si el usuario proporcionó limit u offset
            let result = filtered
            if (limitParam || offsetParam) {
                const limit = Number(limitParam) || filtered.length
                const offset = Number(offsetParam) || 0
                result = filtered.slice(offset, offset + limit)
            }

            return sendJson(res, 200, result)
        }
    }

    if (method === 'POST') {
        if (pathName === '/users') {
            const body = await json(req)
            if (!body || !body.name) {
                return sendJson(res, 400, { error: 'Parametro name es obligatorio'})
            }

            /* Esto respondía con un mensaje y no guardaba age, pero la letra pide responder con el usuario creado (incluido su id) y age es parte del body
            const newUser = {
                name: body.name, 
                id: randomUUID(),
            }

            users.push(newUser)

            return sendJson(res, 201, { message: 'Usuario creado'})
            */

            const newUser = { id: randomUUID(), name: body.name, age: body.age }

            users.push(newUser)

            // Devolvemos el usuario creado (con id), no solo un mensaje
            return sendJson(res, 201, newUser)
        }
    }


    return sendJson(res, 404, { error: 'Not Found' })
})

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})