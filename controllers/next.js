var express = require("express");
// var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var request = require("request");
var db = require('../models');
var flash = require('connect-flash');
// emitter.setMaxListeners(20);
// router.use(bodyParser.urlencoded({extended: false}));


router.get('/', function(req, res){
  console.log('next rest routes reached');
  res.render('auth/next');
});




module.exports = router;
