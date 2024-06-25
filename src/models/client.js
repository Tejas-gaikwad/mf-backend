// models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    username: { type: String, ref: 'Users', required: true },
    arn_number : { type: String, required : true},
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pan_number: { type: String, required: true },
    birth_date: { type: String,},
});

module.exports = mongoose.model('Client', clientSchema);
