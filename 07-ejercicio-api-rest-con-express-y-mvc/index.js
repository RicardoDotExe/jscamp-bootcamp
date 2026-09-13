import express from 'express'
import { readFileSync } from 'node:fs'
import { DEFAULTS } from './config.js'

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/health', (request, response) => {
    return response.json({
        status: 'ok',
        uptime: process.uptime()
    })
})
