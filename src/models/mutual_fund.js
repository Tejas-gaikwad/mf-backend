const mongoose = require('mongoose');



const transactionSchema = new mongoose.Schema({
  transaction_date : { type: Date, required: true },
  transaction_current_value : { type: Number, },
  transaction_amount : { type: mongoose.Schema.Types.Number, },
  transaction_nav : { type: mongoose.Schema.Types.Number,  },
  transaction_profit_and_loss : { type: mongoose.Schema.Types.Number, },
  transaction_units : { type: mongoose.Schema.Types.Number,  },
  transaction_type : { type: String },
  transaction_abs_return : { type: mongoose.Schema.Types.Number,},
  transaction_XIRR : { type: mongoose.Schema.Types.Number,  },
});


const investmentSchema = new mongoose.Schema({
  folio_no : { type: Number,},
  investment_since_date : { type: Date, required: true },
  investment_cost: { type: mongoose.Schema.Types.Number, required: true },
  current_cost: { type: mongoose.Schema.Types.Number,  },
  XIRR: { type: mongoose.Schema.Types.Number, required: true },
  abs_return: { type: mongoose.Schema.Types.Number, required: true },
  today_PnL: { type: mongoose.Schema.Types.Number, required: true },
  total_PnL: { type: mongoose.Schema.Types.Number, required: true },
  investment_scheme_name : {type: String},
  net_asset_value :  {  type: mongoose.Schema.Types.Number,  },
  units :  {  type: mongoose.Schema.Types.Number, },
  current_nav: { type: mongoose.Schema.Types.Number,  },
  tr_mode : {type: String},
  bank_name: {type: String},
  bank_ac_no: {type: String},
  transaction_details : [transactionSchema]
});

const MutualFundMemberSchema = new mongoose.Schema({
    investment_since_date : { type: Date, required: true },
    investment_cost: { type: mongoose.Schema.Types.Number, required: true },
    current_value: { type: mongoose.Schema.Types.Number, required: true },
    XIRR: { type: mongoose.Schema.Types.Number, required: true },
    abs_return: { type: mongoose.Schema.Types.Number, required: true },
    today_PnL: { type: mongoose.Schema.Types.Number, required: true },
    total_PnL: { type: mongoose.Schema.Types.Number, required: true },
    investment_list :  [investmentSchema]
});




module.exports = mongoose.model('mutual_funds', MutualFundMemberSchema);