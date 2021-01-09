const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    forename: 'string',
    surname: 'string',
    user_id: 'string',
    email: 'string'
})

mongoose.model('User', UserSchema)

