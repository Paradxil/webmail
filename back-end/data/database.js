const mongoose = require('mongoose');

class Database {
    constructor() {
    }

    connect() {
        // connect to the database.
        mongoose.connect('mongodb://localhost:27017/webmail', {
            useNewUrlParser: true,
            maxPoolSize: 25
        });
    }
}

//Singleton
module.exports = new Database();