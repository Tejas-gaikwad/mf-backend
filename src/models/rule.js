const mongoose = require('mongoose');

const categoryRuleSchema = new mongoose.Schema({
    category_name: { type: String, required: true },
    minimum_aum_range: { type: String, required: true },
    maximum_aum_range: { type: String, required: true },
    investor_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Investors' },
});

const riskProfileRuleSchema = new mongoose.Schema({
    profile_name: { type: String, required: true },
    minimum_age_range: { type: String, required: true },
    maximum_age_range: { type: String, required: true },
    investor_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Investors' },
});

const CrmSettingsSchema = new mongoose.Schema({
    riskProfileRuleSchema:[riskProfileRuleSchema],
    categoryRuleSchema:[categoryRuleSchema],
    crm_setting_uid : {type: mongoose.Schema.Types.ObjectId, unique: true}
});

const CategoryRule = mongoose.model('CategoryRule', categoryRuleSchema);
const RiskProfileRule = mongoose.model('RiskProfileRule', riskProfileRuleSchema);
const CrmSettings = mongoose.model('CrmSettings', CrmSettingsSchema);

module.exports = { CategoryRule, RiskProfileRule, CrmSettings };
