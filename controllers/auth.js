//stubbing out routes here

// NOTE: simple log-in System which will use GET request to serve HTML page to client and POST request from client to send user name and password to Server

var express = require('express');
var router = express.Router();

// QUESTION: this is routing to pull the page login in auth folder, why do we not need to put .ejs on the end of the file names? -- ANSWER: express modules just knows.
// QUESTION: what is /login referencing after 'get'. I understand its when they click the button but whats the connection? ANSWER: '/login' is what is typed in the browser url bar to access that page; you are establishing and declaring the name of it here.

router.get('/login', function(req, res){
  res.render('auth/login');
});

router.get('/login', function(req, res){
  console.log('req.body is', req.body);
  res.send('login post route - coming soon');
});

router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res){
  console.log('req.body is', req.body);
  res.send('signup post route - coming soon');
});

router.get('/logout', function(req, res){
  res.send('logout post route - coming soon');
});

module.exports = router;
