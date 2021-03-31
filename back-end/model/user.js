var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a scheme for users
const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

// Create a model for users
module.exports = mongoose.model('Users', userSchema);