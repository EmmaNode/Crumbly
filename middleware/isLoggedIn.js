//middleware to detect if you are logged in or not

//defining exports and exporting the function
module.exports = function(req, res, next){
  if(!req.user){ //if there is no username logged in
    req.flash('error', 'you must be logged in to view this page');
    res.redirect('/auth/login');
  }
  else {
    next(); //procede to the next middleware
  }
}
