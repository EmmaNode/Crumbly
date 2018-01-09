var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../models'); //dealing with database in this file reference needed
require('dotenv').config();
//define a way for the passport to serialize and deserialize users
passport.serializeUser(function(user, callback){
  callback(null, user.id);
});

//does opposite of funtion above
passport.deserializeUser(function(id, callback) {
  db.user.findById(id).then(function(user){
    callback(null, user);
  // }).catch(function(err){ //this provides info about the error that occured
  //   callback(err, null);
  });
});

//define passport to actually do what we want it to do
passport.use(new localStrategy({
  //what fields do we want to use
  usernameField: 'email',
  passwordField: 'password'
},  function(email, password, callback){
  //look them up in the database
  db.user.findOne({
      where: { email: email }
  }).then(function(user){
    if(!user || !user.isValidPassword(password)){ //failure condition-didnt find user or entered the wrong password
      callback(null, false);
    }
    else {
      callback(null, user); //either user object or falsey value
    }
  }).catch(function(err){
    callback(err, null); //error or null because there is no user
  });
}));

module.exports = passport;
