// models/MergedClients.js
const mongoose = require('mongoose');

// const mainClientSchema = new mongoose.Schema({
//     clientId: String,
//     client_name: String
// }, { _id: false });

// const mergedClientSchema = new mongoose.Schema({
//     clientId: String,
//     client_name: String
// }, { _id: false });

const mergedClientsSchema = new mongoose.Schema({
    main_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    merged_client_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }],
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investors', required: true }
});

module.exports = mongoose.model('MergedClients', mergedClientsSchema);
