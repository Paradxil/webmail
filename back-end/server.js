const express = require('express');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
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

const UserDAO = require("./data/userDAO");

const app = express();

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/webmail',
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 5 // 5 hours
});

// Catch mongodb session errors
store.on('error', function(error) {
    console.log(error);
});

app.use(session({ 
    secret: 'apples bananas penguins crocodiles polar bears',
    cookie: {
        maxAge: 1000 * 60 * 60 * 5 // 5 hours
    },
    store: store,
    resave: true,
    saveUninitialized: true
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

//Connect to the mongoDB
Database.connect();

// Get mail 
app.post('/api/mail/', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    let handler = new GetMailHandler();
    await handler.handle(req, res);
});

// Sync mailbox
app.post('/api/sync', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    let handler = new SyncMailHandler();
    await handler.handle(req, res);
});

// Send email
app.post('/api/send', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    let handler = new SendMailHandler();
    await handler.handle(req, res);
});

// Get a list of email accounts associated with a user
app.get('/api/accounts', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    let handler = new GetAccountsHandler();
    await handler.handle(req, res);
});

// Add an email account
app.post('/api/account', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    let handler = new AddAccountHandler();
    await handler.handle(req, res);
});

// Register a user
app.post('/api/register', async function(req, res) {
    let handler = new RegisterHandler(req, res);
    await handler.handle(req, res);
});

// Login user
app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

// Get the current user
app.get('/api/user', function(req, res) {
    res.send(req.user||null);
});

// Logout user
app.post('/api/logout',function(req, res){
    req.logout();
    res.redirect('/');
});


app.listen(3002, () => console.log('Server listening on port 3002!'));