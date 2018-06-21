module.exports = {

  // TO ENSURE THAT USER IS LOGGED IN BEFORE GOING TO ANY ROUTE
  // Protecting Routes
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  }
}