//This is the server page and the back end
// Required by session() middleware
// pass the secret for signed cookies
// (required by session())
require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var passport = require('./config/passportConfig');
var request = require('request');
var session = require('express-session');
var app = express();
app.use(express.static(__dirname + '/views'));


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}))
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res,next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.get('/', function(req,res){
  res.render('home');
  // res.send('home page');
});

app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile');
});


// app.get('/findRestaurants', function(req, res) {
    // var yelpUrl = 'https://api.yelp.com/v3/businesses/search';
    //
    // request(yelpUrl, function(error, response, body) {
    //         var restaurant = JSON.parse(body).results;
    //         // console.log(pokemon);
        //     res.send('findRestaurants');
        // });
    // });

    //app.get restaurants info api and append to individual restaurants

    // app.use('/findRestaurants', require('./controllers/auth'));



app.use('/auth', require('./controllers/auth'));
app.use('/pages', require('./controllers/pages'));
//localhost300/favorites
// app.use('/favorites', require('./controllers/pages'));
// app.use('/next', require('./controllers/pages'));
// app.use('/neverAgain', require('./controllers/pages'));

app.listen(process.env.PORT || 2000);


// app.use(session()); // session middleware
// app.use(require('flash')());
//
// app.use(function (req, res) {
//   // flash a message
//   req.flash('info', 'hello!');
//   next();
// })
