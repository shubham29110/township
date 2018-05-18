

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
const https = require("https");
var fs = require('fs');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;
var helper = require('./helpers');

var routes = require('./routes/index');
var users = require('./routes/users');
var superAdmin = require('./routes/superAdmin');
let authenticate=require('./routes/authentication');
let userSetting=require('./routes/userSetting');
const admin=require('./routes/admin');
const tenant=require('./routes/tenant');
const buildings=require('./routes/building');
const ticket=require('./routes/ticket');


// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  helpers: {
    serial: helper.indexing,
    compareSuper:helper.compareSuper,
    compareAdmin: helper.compareAdmin,
    setCheck: helper.setCheck,
    disableReinviteButton: helper.disableReinviteButton
  }
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/superAdmin', superAdmin);
app.use('/auth',authenticate);
app.use('/userSetting',userSetting);
app.use('/admin',admin);
app.use('/tenant',tenant);
app.use('/buildings',buildings);
app.use('/ticket',ticket);
// Set Port
app.set('port', (process.env.PORT || 3000));
/*
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});*/


var options = {
  key: fs.readFileSync("C:/Users/shubhamtiwari/server.key"),
  cert: fs.readFileSync("C:/Users/shubhamtiwari/server.crt")
}

https.createServer(options, app).listen(3000);