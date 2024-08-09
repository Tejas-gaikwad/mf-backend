const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
    investment_cost: { type: mongoose.Schema.Types.Decimal128, required: true },
    current_cost: { type: mongoose.Schema.Types.Decimal128, required: true },
    XIRR: { type: mongoose.Schema.Types.Decimal128, required: true },
    today_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
    total_PnL: { type: mongoose.Schema.Types.Decimal128, required: true },
  });


module.exports = mongoose.model('mutual_funds', mutualFundSchema);