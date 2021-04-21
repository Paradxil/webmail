var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

//Create a scheme for email accounts
const emailAccountSchema = new mongoose.Schema({
    userid: {type: String, required: true},
    email: {type: String, required: true},
    name: String,
    folders: [{
        path: String,
        name: String,
        use: String,
        nicename: String
    }],
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

emailAccountSchema.plugin(encrypt, {secret: process.env.SECRET,
    excludeFromEncryption: ['userid'], 
    additionalAuthenticatedFields: ['userid']});

emailAccountSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.imap.password;
    delete obj.smtp.password;
    return obj;
}


// Create a model for email accounts
module.exports = mongoose.model('EmailAccounts', emailAccountSchema);
