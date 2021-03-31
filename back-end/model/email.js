var mongoose = require('mongoose');

// Create a scheme for emails
const emailSchema = new mongoose.Schema({
    _id: Number,
    userid: String,
    accountid: String,
    folder: String,
    uid: String,
    subject: String,
    message: String,
    html: String,
    from: {
        name: String,
        address: String
    },
    to: {
        name: String,
        address: String
    },
    date: String
});

// Create a model for emails
module.exports = mongoose.model('Emails', emailSchema);