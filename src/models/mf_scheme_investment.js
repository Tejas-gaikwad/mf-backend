const mongoose = require('mongoose');

const mfSchemeinvestmentSchema = new mongoose.Schema({
  scheme_name: { type: String, required: true },
  folio_number: { type: String, required: true },
  inv_since: { type: Date, required: true },
  purchase: { type: Number, required: true },
  switch_in: { type: Number, default: 0 },
  div_reinv: { type: Number, default: 0 },
  redemption: { type: Number, default: 0 },
  switch_out: { type: Number, default: 0 },
  div_pay: { type: Number, default: 0 },
  cur_value: { type: Number, required: true },
  cur_units: { type: Number, required: true },
  cur_nav: { type: Number, required: true },
  gain_loss: { type: Number, required: true },
  abs_rtn: { type: String, required: true },
  xirr: { type: String, required: true }
});

const Investment = mongoose.model('MFSchemeInvestment', mfSchemeinvestmentSchema);
module.exports = Investment;
