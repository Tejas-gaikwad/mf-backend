// models/Client.js
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    pan_number:  { type: String, required: true,  unique: true},
    applicant_kyc_type: String,
    mutual_funds:  Array,
    date_of_birth: String,
    gender: String,
    email:  { type: String, required: true,  unique: true  },
    email_belong_to: String,
    mobile_number:  { type: String, required: true,  unique: true},
    mobile_number_belong_to: String,
    occupation: String,
    mode_of_holdings: String,
    tax_status: String,
    tax_status: String,
    nominee_name: String,
    nominee_relation: String,
    nominee_percentage: String,
    is_nominee_minor: Boolean,
    contact_address: String,
    city:  { type: String, default : ""},
    pincode: { type: String, default : ""},
    state: String,
    country: String,
    risk_profile:{ type: String, default : ""},
    category: { type: String, default : ""},
    company: { type: String, default : ""},
    designation: { type: String, default : ""},

}, { _id: false });


const fatcaSchema = new mongoose.Schema({
    bith_place: String,
    birth_country: String,
    wealth_source: String,
    politically_exposed_person:String,
    address_type: String,
    residence_country: String,
    income_slab: String,
}, { _id: false });

const bankDetailsSchema = new mongoose.Schema({
    account_number: Number,
    account_type: String,
    ifsc_code: String,
    bank_name : String,
}, { _id: false });

const clientDeskSettingsSchema = new mongoose.Schema({
    arn_number: String,
    allow_all_transactions_on_client_desk: Boolean,
    allow_all_redemptions_on_client_desk: Boolean,
}, { _id: false });

const uploadedDocumentsSchema = new mongoose.Schema({
    applicant_signature: { type: String, required: true },
    applicant_cancel_cheque: String,
}, { _id: false });

const clientSchema = new mongoose.Schema({
    investor_uid: { type: String, ref: 'Users', required: true },
    client_video_kyc__data_uid: { type: String, ref: 'ClientVideoKYC' },
    arn_number : { type: String,  required: true },
    relation_ship_with_head :  { type: String,  default:""},
    user_details: userDetailsSchema,
    fatca_detials : fatcaSchema,
    bank_details : bankDetailsSchema,
    client_desk_settings : clientDeskSettingsSchema,
    upload_documents : uploadedDocumentsSchema,
});

module.exports = mongoose.model('Client', clientSchema);
