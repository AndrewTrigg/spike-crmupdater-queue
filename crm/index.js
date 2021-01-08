const express = require('express')
const app = express()
const db = require('./db')

app.get('/ping', (req, res) => {
    res.send('Pong! From the crm app')
})

app.post('/hello', (req, res) => {
    console.log('HELLLOOOOOO')
    res.json({stuff: 'done'})
})

const start = async () => {
    await db
    console.log('************* STARTING CRM *************')
    app.listen(3000, () => console.log('CRM started on port 3000'))
}

start()


