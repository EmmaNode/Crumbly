var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
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

router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next){
  console.log('req.body is', req.body);
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }
  }).spread(function(user, wasCreated){
    if(wasCreated){
      passport.authenticate('local', {
        successRedirect: '/profile',
        successFlash: 'Successfully logged in'
      })(req, res, next);
    }
    else {
      req.flash('error', 'Email already exists')
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
});



module.exports = router;
