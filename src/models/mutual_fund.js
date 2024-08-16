const mongoose = require('mongoose');



const transactionSchema = new mongoose.Schema({
  transaction_date : { type: Date, required: true },
  transaction_current_value : { type: Number, },
  transaction_amount : { type: mongoose.Schema.Types.Decimal128, },
  transaction_nav : { type: mongoose.Schema.Types.Decimal128,  },
  transaction_profit_and_loss : { type: mongoose.Schema.Types.Decimal128, },
  transaction_units : { type: mongoose.Schema.Types.Decimal128,  },
  transaction_type : { type: String },
  transaction_abs_return : { type: mongoose.Schema.Types.Decimal128,},
  transaction_XIRR : { type: mongoose.Schema.Types.Decimal128,  },
});


const investmentSchema = new mongoose.Schema({
  folio_no : { type: Number,},
  investment_since_date : { type: Date, required: true },
  investment_cost: { type: mongoose.Schema.Types.Decimal128, required: true },
  current_cost: { type: mongoose.Schema.Types.Decimal128,  },
  XIRR: { type: mongoose.Schema.Types.Decimal128, required: true },
  abs_return: { type: mongoose.Schema.Types.Decimal128, required: true },
  today_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
  total_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
  investment_scheme_name : {type: String},
  net_asset_value :  {  type: mongoose.Schema.Types.Decimal128,  },
  units :  {  type: mongoose.Schema.Types.Decimal128, },
  current_nav: { type: mongoose.Schema.Types.Decimal128,  },
  tr_mode : {type: String},
  bank_name: {type: String},
  bank_ac_no: {type: String},
  transaction_details : [transactionSchema]
});

const MutualFundMemberSchema = new mongoose.Schema({
    investment_since_date : { type: Date, required: true },
    investment_cost: { type: mongoose.Schema.Types.Decimal128, required: true },
    current_value: { type: mongoose.Schema.Types.Decimal128, required: true },
    XIRR: { type: mongoose.Schema.Types.Decimal128, required: true },
    abs_return: { type: mongoose.Schema.Types.Decimal128, required: true },
    today_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
    total_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
    investment_list :  [investmentSchema]
});




module.exports = mongoose.model('mutual_funds', MutualFundMemberSchema);