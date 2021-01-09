const mongoose = require('mongoose')
const db = require('./db')
require('./models')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const User = mongoose.model('User')


app.set('view engine', 'pug')
app.use('/', express.static(path.join(__dirname, 'public')))
const jsonParser = bodyParser.json()

app.get('/ping', (req, res) => {
    res.send('Pong! From the crm app')
})

app.get('/', async (req, res) => {
    const users = await User.find()
    console.log({ users })
    res.render('index', { users })
})

app.post('/api', jsonParser, async (req, res) => {
    console.log(req.body)
    let user = await User.create(req.body)

    res.json({stuff: user})
})

const start = async () => {
    await db
    console.log('************* STARTING CRM *************')
    app.listen(3000, () => console.log('CRM started on port 3000'))
}

start()


