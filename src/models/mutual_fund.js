const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
    folio_no : { type: Number, required: true },
    investment_since_date : { type: Date, required: true },
    investment_cost: { type: mongoose.Schema.Types.Decimal128, required: true },
    current_cost: { type: mongoose.Schema.Types.Decimal128, required: true },
    XIRR: { type: mongoose.Schema.Types.Decimal128, required: true },
    abs_return: { type: mongoose.Schema.Types.Decimal128, required: true },
    today_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
    total_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
    net_asset_value :  {  type: mongoose.Schema.Types.Decimal128, required: true },
    units :  {  type: mongoose.Schema.Types.Decimal128, required: true },
});

const mutualFundTransactionSchema = new mongoose.Schema({
  transaction_date : { type: Date, required: true },
  transaction_current_value : { type: Date, required: true },
 
});


module.exports = mongoose.model('mutual_funds', mutualFundSchema);