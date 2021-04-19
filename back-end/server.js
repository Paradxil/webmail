require('dotenv').config();

const express = require('express');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Database = require("./data/database");
const GetMailHandler = require("./handlers/getMailHandler");
const SyncMailHandler = require("./handlers/syncMailHandler")
const LoginHandler = require("./handlers/loginHandler");
const RegisterHandler = require("./handlers/registerHandler");
const GetAccountsHandler = require("./handlers/getAccountsHandler");
const AddAccountHandler = require("./handlers/addAccountHandler");
const SendMailHandler = require("./handlers/sendMailHandler");
const DeleteAccountHandler = require("./handlers/deleteAccountHandler");
const UpdateAccountHandler = require("./handlers/updateAccountHandler");
const DeleteMailHandler = require("./handlers/deleteMailHandler");
const CaptchaHandler = require("./handlers/captchaHandler");

const Response = require("./model/response/response");

const UserDAO = require("./data/userDAO");

const app = express();

//Connect to the mongoDB
Database.connect();

var store = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/webmail',
    ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    touchAfter: 3600, // time period in seconds
    autoRemove: 'interval',
    autoRemoveInterval: 10, // In minutes. Default
    crypto: {
        secret: 'apples_bananas_penguins_crocodiles_polar_bears'
    }
});

app.use(session({ 
    secret: 'apples_bananas_penguins_crocodiles_polar_bears',
    cookie: {
        maxAge: 1000 * 60 * 60 * 5 // 5 hours
    },
    saveUninitialized: false,
    resave: false,
    store: store
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


passport.use("local", new LocalStrategy(
    async function(username, password, done) {
        let handler = new LoginHandler;
        return await handler.handle(username, password, done);
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});
  
passport.deserializeUser(async function(id, cb) {
    let userDAO = new UserDAO();
    let user = await userDAO.getUserById(id);
    if(user !== null) {
        cb(null, user);
    }
    else {
        cb(null, null);
    }
});

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.send(Response.Unauthorized());
    }
}

// Get email 
app.post('/api/mail/', isAuthenticated, async (req, res) => {
    let handler = new GetMailHandler();
    await handler.handle(req, res);
});

// Delete an email 
app.post('/api/mail/delete', isAuthenticated, async (req, res) => {
    let handler = new DeleteMailHandler();
    await handler.handle(req, res);
});

// Sync mailbox
app.post('/api/sync', isAuthenticated, async (req, res) => {
    let handler = new SyncMailHandler();
    await handler.handle(req, res);
});

// Send email
app.post('/api/send', isAuthenticated, async (req, res) => {
    let handler = new SendMailHandler();
    await handler.handle(req, res);
});

// Get a list of email accounts associated with a user
app.get('/api/accounts', isAuthenticated, async (req, res) => {
    let handler = new GetAccountsHandler();
    await handler.handle(req, res);
});

//Update an email account
app.post('/api/account/update', isAuthenticated, async (req, res) => {
    let handler = new UpdateAccountHandler();
    await handler.handle(req, res);
});

// Add an email account
app.post('/api/account', isAuthenticated, async (req, res) => {
    let handler = new AddAccountHandler();
    await handler.handle(req, res);
});

// Delete an email account
app.delete('/api/account/:id', isAuthenticated, async (req, res) => {
    let handler = new DeleteAccountHandler();
    await handler.handle(req, res);
});

// Register a user
app.post('/api/register', CaptchaHandler.handle, async function(req, res) {
    let handler = new RegisterHandler(req, res);
    await handler.handle(req, res);
});

// Login user
app.post('/api/login', CaptchaHandler.handle, passport.authenticate('local'), function(req, res) {
    if(req.user !== null && req.user !== undefined) {
        res.send(Response.Success({user: req.user}));
    }
    else {
        res.send(Response.Error("Invalid username or password."));
    }
});

// Get the current user
app.get('/api/user', isAuthenticated, function(req, res) {
    res.send(Response.Success({user: req.user}));
});

// Logout user
app.post('/api/logout', isAuthenticated, function(req, res){
    req.session.destroy(function (err) {
        if(err) {
            res.send(Response.Error("Error logging out."));
            return;
        }
        req.logout();
        res.send(Response.Success());
    });
});


app.listen(3002, () => console.log('Server listening on port 3002!'));