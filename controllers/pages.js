require('dotenv').config();
var express = require("express");
var isLoggedIn = require('../middleware/isLoggedIn');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var request = require("request");
var db = require('../models');
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

//STARTING SEARCH PAGE
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

//FAVORITES GET POST
router.get('/favorites', isLoggedIn, function(req, res){
  // console.log('fav routes reached');
  // res.render('pages/favorites');
  db.user.findOne({
    where: { id: req.user.id },
    include: [db.content]
  })
  .then(function(user) {
    res.render('pages/favorites', { user: user });
  })
  .catch(function(err) {
    console.log('my error is ' + err);
  });
});

//user.contents.forEach reference in visual pages


//This grabs the input information from client when they click a button, it finds a duplicate or creates a new one and attaches the user ID | spread is a promise because it takes a long time.
router.post('/favorites', isLoggedIn, function(req, res){
  // console.log('post to favs reached');
  //  res.send('pages/favorites');
  // res.render('pages/favorites');
  db.content.findOrCreate({
    where: {
      restaurantname: req.body.name,
      restaurantId: req.body.id,
      restaurantimage: req.body.image_url
    },
    defaults: {
      userId: req.user.id
    }
  }).spread(function(restaurant, wasCreated) {
    if (wasCreated) {
      res.redirect('/pages/favorites')
    }  else {
      res.redirect('/pages/favorites')
    }
  }).catch(function(err){
    console.log('my error is ', err);
  });
});

//NEXT GET POST
router.get('/next', isLoggedIn, function(req, res){
  console.log('next rest routes reached');
  res.render('pages/next');
});

router.post('/next', isLoggedIn, function(req, res){
  console.log('up next reached');
  // res.send('pages/next');
  res.render('pages/next');
});

//NEVERAGAIN GET POST
router.get('/neverAgain', isLoggedIn, function(req, res){
  console.log('neverAgain route reached');
  res.render('pages/neverAgain');
});

router.post('/neverAgain', isLoggedIn, function(req, res){
  console.log('neverAgain reached');
  // res.send('pages/neverAgain');
  res.render('pages/neverAgain');
});



module.exports = router;
