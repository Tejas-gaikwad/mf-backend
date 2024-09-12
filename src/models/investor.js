// Define User schema

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const investorSchema = new mongoose.Schema({
    investor_uid: { type:  mongoose.Schema.Types.ObjectId,  unique: true },
    arnNumber: { type: String },
    full_name: { type: String, },
    mobile: { type: String,  unique: true },
    city : {type: String, },
    login_type : {type: String,  },
    password : {type: String,},
    merged_clients_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MergedClients', default: [] }],
    family_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FamilySchema', default: [] }],
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: [] }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notifications', default: [] }],
    crm_settings: { type: mongoose.Schema.Types.ObjectId, ref: 'CrmSettings' },
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendors', default: [] }],
    terms_and_conditions : { type: mongoose.Schema.Types.ObjectId, ref: 'terms_and_conditions', default: null },
    about_us : { type: mongoose.Schema.Types.ObjectId, ref: 'about_us_collection', default: null },
  });

  investorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model('Investors', investorSchema);