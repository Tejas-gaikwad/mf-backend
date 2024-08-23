// models/Client.js
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    name_as_per_pan: String,
    mobile_number:  { type: String, required: true,  unique: true},
    email:  { type: String, required: true,  unique: true  },
    city: String,
}, { _id: false });

const identitySchema = new mongoose.Schema({
    name: String,
    pan_photo: String,
    father_name: String,
    pan_number: String,
    identity_proof_type: String,
    date_of_birth: String,
}, { _id: false });


const addressProofSchema = new mongoose.Schema({
    address_proof_type: String,
    upload_front_photo : String,
    upload_back_photo : String,
    name: String,

    passport_number: String,
    passport_issue_date: String,
    passport_issue_date: String,
    passport_expiry_date: String,

    driving_license_number: String,
    driving_license_issue_date: String,
    driving_license_expiry_date: String,

    epic_voter_id_number: String,

    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    date_of_birth: String,
    correspondance_address_same: String,
   
}, { _id: false });

const correspondenceSchema = new mongoose.Schema({
    address_proof_type: String,
    upload_front_photo : String,
    upload_back_photo : String,
    name: String,

    passport_number: String,
    passport_issue_date: String,
    passport_issue_date: String,
    passport_expiry_date: String,

    driving_license_number: String,
    driving_license_issue_date: String,
    driving_license_expiry_date: String,

    epic_voter_id_number: String,

    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    date_of_birth: String,
   
}, { _id: false });



const forms_schema = new mongoose.Schema({

    gender: String,
    martial_status: String,
    nominee_relation_with_you: String,

    nominee_name: String,
    nominee_mother_name: String,

    citizenship: String,
    email: String,

    occupation_type: String,
    mobile_number: String,

    communication_address_type: String,
    permanent_address_type: String,

    annual_income: String,
    place_of_birth: String,
})

const fatcaSchema = new mongoose.Schema({
    politicallY_exposed_person: String,
    related_to_politicallY_exposed_person: String,
    residence_for_tax_purpose_outside_india: String,
}, { _id: false });

const signature = new mongoose.Schema({
    signature_image : String,
}, { _id: false })

const photo = new mongoose.Schema({
    recent_photo : String,
}, { _id: false })

const video = new mongoose.Schema({
    video_link : String,
}, { _id: false });

const clientVideoKycSchema = new mongoose.Schema({
    // investor_uid: { type: String, ref: 'Users', required: true },
    arn_number : { type: String,  required: true },
    user_details: userDetailsSchema,
    identity: identitySchema,
    address: addressProofSchema,
    correspondenceSchema: correspondenceSchema,
    forms:forms_schema,
    fatca_details : fatcaSchema,
    signature:signature,
    photo: photo,
    video: video,
});

module.exports = mongoose.model('ClientVideoKYC', clientVideoKycSchema);
