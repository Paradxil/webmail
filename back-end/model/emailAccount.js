var mongoose = require('mongoose');

//Create a scheme for email accounts
const emailAccountSchema = new mongoose.Schema({
    userid: {type: String, required: true},
    email: {type: String, required: true},
    name: String,
    folders: [String],
    imap: {
        host: {type: String, required: true},
        port: {type: String, required: true},
        secure: Boolean,
        user: {type: String, required: true},
        password: String
    },
    smtp: {
        host: {type: String, required: true},
        port: {type: String, required: true},
        secure: Boolean,
        user: {type: String, required: true},
        password: String
    }
});

// Create a model for email accounts
module.exports = mongoose.model('EmailAccounts', emailAccountSchema);