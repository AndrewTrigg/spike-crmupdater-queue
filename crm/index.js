const mongoose = require('mongoose')
const db = require('./db')
require('./models')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const User = mongoose.model('User')

let disabled = false

app.set('view engine', 'pug')
app.use('/', express.static(path.join(__dirname, 'public')))
const jsonParser = bodyParser.json()

app.get('/ping', (req, res) => {
    res.send('Pong! From the crm app')
})

app.get('/', async (req, res) => {
    const users = await User.find()
    res.render('index', { users })
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

app.post('/api', jsonParser, async (req, res) => {
    if (disabled) {
        console.log('The api is down!!')
        return res.sendStatus(500)
    }
    if (req.body.badRequest) {
        return res.sendStatus(400)
    }
    console.log('Successfully hit api endpoint!!')
    let user = await User.findOneAndUpdate({user_id: req.body.user_id}, req.body, {upsert: true})
    res.json({stuff: user})
})

app.get('/api/toggle-disable', (req, res) => {
    disabled = !disabled
    res.send(disabled)
})

app.delete('/api/users/:user_id', async (req, res) => {
    const result = await User.findOneAndDelete({ user_id: req.params.user_id})
    console.log({result})
    res.send(result)
})

const start = async () => {
    await db
    console.log('************* STARTING CRM *************')
    app.listen(3000, () => console.log('CRM started on port 3000'))
}

start()


