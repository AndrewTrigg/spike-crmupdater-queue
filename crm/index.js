const express = require('express')
const app = express()
const db = require('./db')
const path = require('path')
const bodyParser = require('body-parser')

app.set('view engine', 'pug')
app.use('/static', express.static(path.join(__dirname, 'public')))
const jsonParser = bodyParser.json()

app.get('/ping', (req, res) => {
    res.send('Pong! From the crm app')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/api', jsonParser, (req, res) => {
    console.log(req.body)
    // res.redirect('/')
    res.json({stuff: 'done'})
})

const start = async () => {
    await db
    console.log('************* STARTING CRM *************')
    app.listen(3000, () => console.log('CRM started on port 3000'))
}

start()


