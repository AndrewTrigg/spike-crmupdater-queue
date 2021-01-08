const express = require('express')
const app = express()
const fetch = require('node-fetch')

app.get('/ping', (req, res) => {
    res.send('Pong! From the platform app')
})

app.get('/fetch', async (req, res) => {
    let json
    try {
        let resp = await fetch('http://crm:3000/hello', {
            method: 'post',
            body: JSON.stringify({a: 1}),
            headers: { 'Content-Type': 'application/json' }
        })
        json = await resp.json()

    } catch (err) {
        console.log(err)
    }
    res.send(json)
})

app.listen(4000, () => console.log('Platform started on port 4000'))