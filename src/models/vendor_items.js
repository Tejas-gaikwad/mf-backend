


const mongoose = require('mongoose');

const VendorItemsSchema = new mongoose.Schema({
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    item_name: { type: String,  },
    item_price: { type: String, },
});

module.exports = mongoose.model('VendorItems', VendorItemsSchema);