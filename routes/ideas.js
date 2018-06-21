const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// using destructuring
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea modal
require('../models/Idea');
const Idea = mongoose.model('ideas');

// ROUTES FOR IDEAS


//** IN THIS ROUTE PAGE, BEGINNING '/' IN THE ROUTE POINTS TO '/ideas' 

// ADD IDEA FORM ROUTE
router.get('/add', ensureAuthenticated, (req, res) => {
  // ADDING IDEAS USING FORM
  res.render('ideas/add');
});


// POSTING, PROCESSING AND SAVING IDEA TO MONGODB
router.post('/', ensureAuthenticated, (req, res) => {
  // res.send('ideas processed');
  // body-parser is required. 
  // "req.body" is an obj with all our form-fields
  // console.log(req.body); 

  // VALIDATING ON SERVER SIDE
  let errors = [];

  if (!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if (!req.body.details) {
    errors.push({text: 'Please add some details'});
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    // res.send('passed');
    // IF VALID, THEN CREATE NEW IDEA AND SAVE IT TO MONGODB
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      })
    /*
    cmd: 
      cd mongodb/bin
      mongo
        show dbs
        use dbName
        show collections
        db.collectionName.find();
    */  
  }
});


// IDEA INDEX PAGE
router.get('/', ensureAuthenticated, (req, res) => {
  // FETCHING IDEAS FROM MONGODB
  Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
      // RENDERING ALL THE IDEAS
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// EDIT IDEA FORM ROUTE
router.get('/edit/:id', ensureAuthenticated, (req, res) => { // ':id' is a parameter OR placeholder which is diff
  // EDITING THE particular IDEA using id
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// EDIT FORM PROCESS
router.put('/:id', ensureAuthenticated, (req, res) => {
  // res.send('PUT');
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Video idea updated');
        res.redirect('/ideas');
      })
  });
});
//** we cant just change the method="put" in form to update changes. 
// So we have to dl "method-override" module 
// 2 ways to implement: using header or query-value
// other option is to use AJAX.


// DELETE ROUTE
router.delete('/:id', ensureAuthenticated, (req, res) => {
  // res.send('del');
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    });
});


module.exports = router;