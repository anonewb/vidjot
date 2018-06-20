const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Load User modal
require('../models/User');
const User = mongoose.model('users');

// ROUTES FOR USERS

// USER LOGIN ROUTE
router.get('/login', (req, res) => {
  res.render('users/login');
});

// USER REGISTER ROUTE
router.get('/register', (req, res) => {
  res.render('users/register');
});

// USER REGISTER ROUTE
router.post('/register', (req, res) => {
  // console.log(req.body);
  // res.send('register');

  // server side validation
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // check if email is already registered
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          // create new user using User model
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          // storing pass in db using 'bcrypt'
          /*
          1st generating salt of 10 chars,
          then applying hash to our password using salt,
          then setting new hashed pass to our pass
          and finally save in db
          */
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});



module.exports = router;