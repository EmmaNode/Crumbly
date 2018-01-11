require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var request = require("request");
var db = require('../models');
var flash = require('connect-flash');
// var isLoggedIn = require('./middleware/isLoggedIn');
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.API_KEY);

function yelpSearch(searchTerm, location, callback){
    client.search({
      term: searchTerm,
      location: location
    }).then(response => {
      // console.log(response.jsonBody.businesses[0].name);
      // console.log(response.jsonBody.businesses);
      response.jsonBody.businesses.forEach(function(item){
        // console.log(item.name);
      });
      callback(response.jsonBody.businesses);
    }).catch(e => {
      console.log(e);
    });
}


router.get('/', function(req, res){
  console.log('api data page route reached');
  res.send('api page');
});

router.get('/findRestaurants', function(req, res){
  console.log('find rest route reached');
  res.render('pages/findRestaurants', { businesses: null });
});

router.post('/searchresults', function(req, res){
  // console.log(req.body);
  yelpSearch(req.body.searchbox, req.body.location, function(businesses) {
    res.render('pages/findRestaurants', {businesses : businesses} );
  });
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
