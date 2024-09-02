// Define User schema

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const investorSchema = new mongoose.Schema({
    investor_uid: { type:  mongoose.Schema.Types.ObjectId,  unique: true },
    arnNumber: { type: String,  unique: true },
    full_name: { type: String, },
    mobile: { type: String,  unique: true },
    city : {type: String, },
    login_type : {type: String,  },
    password : {type: String,},
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: [] }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notifications', default: [] }],
    crm_settings : { type: mongoose.Schema.Types.ObjectId, ref: 'CrmSettings',  },
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