// Define User schema

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true  },
    arnNumber: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, },
    city : {type: String, },
    login_type : {type: String, required : true, },
    password : {type: String, required : true},
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: [] }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notifications', default: [] }],
  });

userSchema.pre('save', async function (next) {
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


module.exports = mongoose.model('Users', userSchema);