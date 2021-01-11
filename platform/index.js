const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const Queue = require('bull')
const crmQueue = new Queue('crm updates', 'redis://redis:6379')
const Arena = require('bull-arena')

Arena({
    Bull: Queue,
    queues: [
        {
            name: 'crm updates',
            hostId: 'Queue server 1',
            url: 'redis://redis:6379'
        }
    ]
})

app.set('view engine', 'pug')
app.use('/static', express.static(path.join(__dirname, 'public')))
const urlencodedParser = bodyParser.urlencoded({ extended: false })

crmQueue.process('*', async function (job, done) {
    // console.log({job})
    let c = await crmQueue.getDelayed()
    console.log({c})
    let b = await crmQueue.getJobs('crm updates')
    console.log({b})
    let a = await crmQueue.getJobs(job.name)
    console.log({a})
    try {
        let data = await fetch('http://crm:3000/api', {
            method: 'post',
            body: job.data.update,
            headers: { 'Content-Type': 'application/json' }
        })
        await data.json()
        done()
    } catch (err) {
        console.log('Request failed!')
        done(new Error(err))
    }
})

app.get('/ping', (req, res) => {
    res.send('Pong! From the platform app')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', urlencodedParser, async (req, res) => {
    const nonNullValues = {}
    for (let [key, value] of Object.entries(req.body)) {
        if (value) {
            nonNullValues[key] = value
        }
    }
    console.log({nonNullValues})
    crmQueue.add(
        req.body.user_id, 
        { update: JSON.stringify(nonNullValues) }, 
        { 
            backoff: { type: 'exponential', delay: 2000 },
            attempts: 20 
        }
    )
    res.redirect('/')
})

app.listen(4000, () => console.log('Platform started on port 4000'))