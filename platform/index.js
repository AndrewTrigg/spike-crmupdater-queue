const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')


app.set('view engine', 'pug')
app.use('/static', express.static(path.join(__dirname, 'public')))
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/ping', (req, res) => {
    res.send('Pong! From the platform app')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', urlencodedParser, async (req, res) => {
    console.log(req.body)
    let json
    try {
        let resp = await fetch('http://crm:3000/api', {
            method: 'post',
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' }
        })
        json = await resp.json()

    } catch (err) {
        console.log(err)
    }
    console.log({json})
    res.redirect('/')
})



app.listen(4000, () => console.log('Platform started on port 4000'))