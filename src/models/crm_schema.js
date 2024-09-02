const mongoose = require('mongoose');

const categoryRuleSchema = new mongoose.Schema({
    category_name: { type: String,  },
    minimum_aum_range: { type: String, },
    maximum_aum_range: { type: String, },
    investor_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor' },
    // rule_id : {type: mongoose.Schema.Types.ObjectId,}
}, { _id: true });

const riskProfileRuleSchema = new mongoose.Schema({
    profile_name: { type: String,  },
    minimum_age_range: { type: String,  },
    maximum_age_range: { type: String, },
    investor_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor' },
    // rule_id : {type: mongoose.Schema.Types.ObjectId,}
}, { _id: true });


const crmSettingsSchema = new mongoose.Schema({
    crm_setting_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor' },
    categoryRuleSchema: [categoryRuleSchema],
    riskProfileRuleSchema: [riskProfileRuleSchema]
});

module.exports = mongoose.model('CrmSettings', crmSettingsSchema);
