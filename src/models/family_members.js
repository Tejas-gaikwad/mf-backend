const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
    head_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    family_members_client_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }],
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investors', required: true }
});

module.exports = mongoose.model('FamilySchema', FamilySchema);
