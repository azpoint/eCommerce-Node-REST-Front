const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, max: 20 },
    password: { type: String, required: true },
    admin:{ type: Boolean, required: true }
})

module.exports = model('user', userSchema)