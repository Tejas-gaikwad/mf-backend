// models/Client.js
const mongoose = require('mongoose');
const userDetailsSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    pan_number: String,
    applicant_kyc_type: String,
    date_of_birth: String,
    gender: String,
    email: String,
    email_belong_to: String,
    mobile_number: String,
    mobile_number_belong_to: String,
    occupation: String,
    mode_of_holdings: String,
    tax_status: String,
    tax_status: String,
    nominee_name: String,
    nominee_relation: String,
    nominee_percentage: String,
    is_nominee_minor: Boolean,
    applicant_contact_address: String,
    applicant_city: String,
    applicant_pincode: String,
    applicant_state: String,
    applicant_country: String,
});
const fatcaSchema = new mongoose.Schema({
    bith_place: String,
    birth_country: String,
    wealth_source: String,
    politically_exposed_person: Boolean,
    address_type: String,
    residence_country: String,
    income_slab: String,
});
const bankDetailsSchema = new mongoose.Schema({
    account_number: String,
    account_type: String,
    ifsc_code: String,
});
const clientSchema = new mongoose.Schema({
    username: { type: String, ref: 'Users', required: true },
    arn_number : { type: String, required : true},
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pan_number: { type: String, required: true },
    birth_date: { type: String,},
    user_details: userDetailsSchema,
    fatca_detials : fatcaSchema,
    bank_details : bankDetailsSchema,
});
module.exports = mongoose.model('Client', clientSchema);