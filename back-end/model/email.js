var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

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
    flags: [String], //Used for standard IMAP flags such as '\Seen' and '\Deleted'
    customFlags: [String], //Used for flags that cannot be saved to an IMAP server such as 'starred'
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

//emailSchema.plugin(encrypt, {secret: process.env.SECRET,
 //   excludeFromEncryption: ['folder', 'accountid'], 
 //   additionalAuthenticatedFields: ['folder', 'accountid']});

// Create a model for emails
module.exports = mongoose.model('Emails', emailSchema);