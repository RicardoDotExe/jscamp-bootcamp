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

    if (method === 'GET') {
        if (url === '/health') {
            return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
        }

        if (url === '/users') {
            return sendJson(res, 200, users)
        }
    }

    if (method === 'POST') {
        if (url === '/users') {
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