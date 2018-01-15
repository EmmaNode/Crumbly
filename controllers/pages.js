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
var content = require('../models/content');


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
      restaurantimage: req.body.image_url,
      opinion: req.body.opinion
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


//update where restaurant id = req.body.id updat entry column
// JOURNAL ENTRY GET AND POST
router.get('/entry', isLoggedIn, function(req, res){
  console.log('entry get route reached');
  res.send('pages/entry');
});

router.post('/entry', isLoggedIn, function(req, res){
  console.log('post route', req.body);
  db.content.findOne({
    where: {
      id: req.body.restaurantId
    }
  }).then(function(restaurant){
    console.log('then promise', restaurant);
    restaurant.entry = req.body.commentText;
    restaurant.save().then(function(updatedRestaurant){
      res.redirect('/pages/favorites');
    }).catch(function(err){
      console.log('error - catch 1', err);
      res.send('ERROR');
    });
  }).catch(function(err){
    console.log('error - catch 2', err);
    res.send('ERROR');
  });
});
  // console.log('entry reached');
  // res.send('pages/enty');
  // res.render('pages/next');




//NEXT GET POST
router.get('/next', isLoggedIn, function(req, res){
  db.user.findOne({
    where: { id: req.user.id,
      'opinion': 'next'
     },
    include: [db.content]
  })
  .then(function(user) {
    res.render('pages/next', { user: user });
  })
  .catch(function(err) {
    console.log('my error is ' + err);
  });
});

router.post('/next', isLoggedIn, function(req, res){
  db.content.findOrCreate({
    where: {
      opinion: req.body.opinion,
      restaurantname: req.body.name,
      restaurantId: req.body.id,
      restaurantimage: req.body.image_url
    },
    defaults: {
      userId: req.user.id
    }
  }).spread(function(restaurant, wasCreated) {
    if (wasCreated) {
      res.redirect('/pages/next')
    }  else {
      res.redirect('/pages/next')
    }
  }).catch(function(err){
    console.log('my error is ', err);
  });
});

//NEVERAGAIN GET POST
router.get('/neverAgain', isLoggedIn, function(req, res){
  db.user.findOne({
    where: { id: req.user.id },
    include: [db.content]
  })
  .then(function(user) {
    res.render('pages/neverAgain', { user: user });
  })
  .catch(function(err) {
    console.log('my error is ' + err);
  });
});

router.post('/neverAgain', isLoggedIn, function(req, res){
  db.content.findOrCreate({
    where: {
      restaurantname: req.body.name,
      restaurantId: req.body.id,
      restaurantimage: req.body.image_url,
      opinion: req.body.opinion
    },
    defaults: {
      userId: req.user.id
    }
  }).spread(function(restaurant, wasCreated) {
    if (wasCreated) {
      res.redirect('/pages/neverAgain')
    }  else {
      res.redirect('/pages/neverAgain')
    }
  }).catch(function(err){
    console.log('my error is ', err);
  });
});

//UPDATE FUNCTION NECESSARY?


//DELETE Router
router.delete('/:id', isLoggedIn, function(req,res){
	db.content.findOne({
		where: {id: req.params.id}
	}).then(function(recipe){
		db.content.destroy({
			where: {id: req.params.id}
		}).then(function(deleted){
			res.send('all good');
		});
	}).catch(function(err){
		res.send('uh oh', err);
	});
});
//

module.exports = router;
