const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
 
const app = express();
const User = require('./models/user.model');

// Express session
app.use(
  session({
    secret: 'somesecretword',
    resave: true,
    saveUninitialized: true
  })
);
app.use(cookieParser());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy(
  {
    usernameField: 'real_name',
    passwordField: 'password'
  },

  function (real_name, password, done) {
    User.findOne({ real_name: real_name }, function (err, user) {
      if (err) {
        console.log("Authentication failed because of error.");
        return done(err);
      }
      if (!user) {
        console.log("Authentication failed because of username.");
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validatePassword(password)) {
        console.log("Authentication failed because of password.");        
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }

      console.log("Authentication success");
      return done(null, user);
    });
  }
));

const auth_conf = require('./config/db_auth.json');

// Set up mongoose connection
// Todo: change back to production db
let dev_db_url = 'mongodb://' + auth_conf.username + ':' + auth_conf.password + '@ds213053.mlab.com:13053/mek-test';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up routes
const userRoute = require('./routes/user.route');
const indexRoute = require('./routes/index.route');
const investmentRoute = require('./routes/investment.route');
const correctionRoute = require('./routes/correction.route');
const financeRoute = require('./routes/finance.route');


app.use('/user', userRoute);
app.use('/', indexRoute);
app.use('/investment', investmentRoute);
app.use('/correction', correctionRoute);
app.use('/finance', financeRoute);

// EJS
app.set('view engine', 'ejs');

// Static directory
app.use(express.static('static'));

// Run server
let port = 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
