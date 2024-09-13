// models/Client.js
const mongoose = require('mongoose');

const PersonalInformationSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    mobile_number:  { type: String, unique: true},
    phone_number:  { type: String, unique: true},
    pan_number:  { type: String, required: true,  unique: true},
    aadhar_number:  { type: String, required: true,  unique: true},
    email:  { type: String, required: true,  unique: true  },
    designation: { type: String, default : ""},
    date_of_joining :  { type: String, default : ""},   
    anniversary : { type: String, default : ""},
    anniversary_date : { type: String, default : ""},
    address : { type: String, default : ""},

}, { _id: false });


const AccessControl = new mongoose.Schema({
    li_section: { type: Boolean},
    fd_section: { type: Boolean},
    mf_section: { type: Boolean},
    commodities_section: { type: Boolean},
    wealth_reports_section: { type: Boolean},
    utilities_section: { type: Boolean},
    goal_gps_section:{ type: Boolean},
    gi_section:{ type: Boolean},
    po_section: { type: Boolean},
    equity_section:{ type: Boolean},
    real_estate_section: { type: Boolean},
    uploads_section: { type: Boolean},
    financial_planning_section:{ type: Boolean},
    invest_online_section: { type: Boolean},
}, { _id: false });

const BankDetailsSchema = new mongoose.Schema({
    bank_name: String,
    bank_address: String,
    bank_account_number: String,
    bank_ifsc : String,
}, { _id: false });

const UploadedDocumentSchema = new mongoose.Schema({
    uploaded_document: String,
}, { _id: false });

const employeeSchema = new mongoose.Schema({
    investor_uid: { type: String, ref: 'Investor', required: true },
    // client_video_kyc__data_uid: { type: String, ref: 'ClientVideoKYC' },
    // arn_number : { type: String,  required: true },
    // relation_ship_with_head :  { type: String,  default:""},
    personal_information: PersonalInformationSchema,
    bank_information : BankDetailsSchema,
    access_control : AccessControl,
    upload_documents : UploadedDocumentSchema,
});

module.exports = mongoose.model('Employee', employeeSchema);
