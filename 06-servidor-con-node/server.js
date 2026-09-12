import { json } from 'node:stream/consumers'
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

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

    if (Number.isNaN(Number(searchParams.get('limit')) ||
            Number(searchParams.get('offset')))) {
            return sendJson(res, 400, { error: 'limit y offset deben de ser numeros'})
            }

    if (method === 'GET') {
        if (pathName === '/health') {
            return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
        }

        if (pathName === '/users') {
            const limit = Number(searchParams.get('limit')) || users.length
            const offset = Number(searchParams.get('offset')) || 0
            const paginatedUsers = users.slice(offset, offset + limit)

            return sendJson(res, 200, paginatedUsers)
        }
    }

    if (method === 'POST') {
        if (pathName === '/users') {
            const body = await json(req)
            if (!body || !body.name) {
                return sendJson(res, 400, { error: 'Parametro name es obligatorio'})
            }

            const newUser = {
                name: body.name, 
                id: randomUUID(),
            }

            users.push(newUser)

            return sendJson(res, 201, { message: 'Usuario creado'})
        }
    }


    return sendJson(res, 404, { error: 'Not Found' })
})

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})