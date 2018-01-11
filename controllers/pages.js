require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var request = require("request");
var db = require('../models');
var flash = require('connect-flash');
// emitter.setMaxListeners(20);
// router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function(req, res) {
    var url = 'GET https://api.yelp.com/v3/businesses/north-india-restaurant-san-francisco';
    request({
      method: 'GET',
      url: url,
      qs: {
        // limit: 20,
        apikey: process.env.API_KEY,
     },
     json: true,
   }, function(error, response, body) {
      console.log(response);
     // body above is the object being retruned from the API
     // res.render('index', {results:dataObj.businesses});
  // so we are sending that object, and the first object in it called data (named by giphy) to ejs called data

  });
});



  // console.log('api data will go here');
  // res.send('pages');
  // var qs = {
  //   	// s: "indian",
  //   	apikey: process.env.API_KEY
  //   }

//     request({
//       request('http://www.google.com', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Show the HTML for the Google homepage.
//   }
// });



// });

router.get('/findRestaurants', function(req, res){
  console.log('find rest route reached');
  res.render('pages/findRestaurants');
});

router.get('/favorites', function(req, res){
  console.log('fav routes reached');
  res.render('pages/favorites');
});

router.get('/next', function(req, res){
  console.log('next rest routes reached');
  res.render('pages/next');
});

router.get('/neverAgain', function(req, res){
  console.log('neverAgain route reached');
  res.render('pages/neverAgain');
});



module.exports = router;
