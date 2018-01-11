//stubbing out routes here

// NOTE: simple log-in System which will use GET request to serve HTML page to client and POST request from client to send user name and password to Server

// QUESTION: this is routing to pull the page login in auth folder, why do we not need to put .ejs on the end of the file names? -- ANSWER: express modules just knows.
// QUESTION: what is /login referencing after 'get'. I understand its when they click the button but whats the connection? ANSWER: '/login' is what is typed in the browser url bar to access that page; you are establishing and declaring the name of it here.

var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
// var isLoggedIn = require('/middleware/isLoggedIn');
var router = express.Router();

router.get('/login', function(req, res){
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  successFlash: 'Login Successful',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid Credentials'
}));
// router.get('/login', function(req, res){
  // console.log('req.body is', req.body);
  // res.send('login post route - coming soon');
// });

router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next){
  console.log('req.body is', req.body);
  // res.send('signup post route - coming soon');
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: { //in the case it is creating a user and did not find an existing username
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }
  }).spread(function(user, wasCreated){ //spread is a promise that runs after the database has been called, tells you if it was found or created
    if(wasCreated){
      //Good job, you didn't try to make a duplicate
      //this part is calling a function
      passport.authenticate('local', {
        successRedirect: '/profile',
        successFlash: 'Successfully logged in'
      })(req, res, next);
    }
    else {
      //bad job you tried to sign up when username already exists
      req.flash('error', 'Email already exists') //1st type is what kind of message 2nd text is what is the message going to be displayed
      res.redirect('/auth/login');
    }
  }).catch(function(err){
    req.flash('error', err.message);
    console.log('user not created', err.message);
    res.redirect('/auth/signup');
  });
});

router.get('/logout', function(req, res){
  console.log('can I logout??');
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/');
  // res.send('logout post route - coming soon');
});

//creates a route that grabs the info api for each restaurant url
// router.get('/findRestaurants', function(req, res){
//   res.render('auth/findRestaurants');
// });

module.exports = router;
