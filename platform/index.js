const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const Queue = require('bull')

const crmQueue = new Queue('crm updates', 'redis://redis:6379', {settings: {
    backoffStrategies: {
        custom: function (attemptsMade, err) {
            if (err.message === '400') return -1
            return (Math.pow(2, attemptsMade) * 1000)
        }
    }
}})

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
    // let delayedItems = await crmQueue.getDelayed()

    // let updates = [...delayedItems, job]
    //     .filter(delayedItem => delayedItem.name === job.name )

    // let currentRecordUpdates = updates
    //     .sort((itemA, itemB) => +itemA.id - +itemB.id)
    //     .map(item => JSON.parse(item.data.update))

    // if (currentRecordUpdates.length > 1) {
    //     await Promise.all(updates.map(update => crmQueue.removeJobs(update.id)))
    //     let combined = currentRecordUpdates.reduce((acc, curr) => ({...curr, ...acc}), {})  
    //     crmQueue.add(
    //         combined.user_id, 
    //         { update: JSON.stringify(combined) }, 
    //         { 
    //             delay: 2000,
    //             backoff: { type: 'exponential', delay: 2000 },
    //             attempts: 20 
    //         }
    //     )  
    // }

    try {
        let data = await fetch('http://crm:3000/api', {
            method: 'post',
            body: job.data.update,
            headers: { 'Content-Type': 'application/json' }
        })
        if (data.status >= 300) {
            throw (new Error(data.status))
        } else {
            await data.json()
            done()
        }
    } catch (err) {
        done(err)
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
            backoff: { type: 'custom', delay: 2000 },
            attempts: 20 
        }
    )
    res.redirect('/')
})

app.listen(4000, () => console.log('Platform started on port 4000'))