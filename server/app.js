//inclue thư viện ở đây
const express       = require('express');
const passport      = require('passport');
const session       = require('express-session');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
secret              = require('./config/config').secret;
jwt                 = require('jsonwebtoken');
const morgan        = require('morgan');

//configure ở đây
const port      = process.env.PORT || 3000;
const configDB  = require('./config/database');

//run database ở đây
if (configDB.test == 'local')
    mongoose.connect(configDB.localAddress);
else
    mongoose.connect(configDB.serverAddress);

//run nodemon app.js
const app = express();

app.use(express.static(__dirname + '/resources'));
app.use(express.static(__dirname + '/doc'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

//authenticate
app.use(session({
    secret : secret,
    resave : true,
    proxy  : true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.listen(port);

//configure passport
require('./config/passport')(app);

//router
require('./app/router')(app, passport);
