const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    vendor_name: { type: String, required: true },
    mobile_number: { type: String, required: true, unique: true },
    email_address: { type: String, required: true, unique: true },
    address: { type: String, required: true },
});

module.exports = mongoose.model('Vendors', vendorSchema);