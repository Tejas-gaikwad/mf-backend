const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    investor_uid : { type: String },
    notification_heading : { type: String, required: true },
    notification_content : { type: String, required: true },
    notification_date : { type: Date, required: true },
});


module.exports = mongoose.model('notifications', notificationSchema);