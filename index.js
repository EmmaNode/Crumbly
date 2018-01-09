//This is the server page and the back end
// Required by session() middleware
// pass the secret for signed cookies
// (required by session())
require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var session = require('express-session');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}))
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.get('/', function(req,res){
  res.render('home');
  // res.send('home page');
});

app.listen(process.env.PORT || 3000);
