const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    user_id: { type: String, unique: true, required: true, trim: true },
    forename: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true }
})

mongoose.model('User', UserSchema)

