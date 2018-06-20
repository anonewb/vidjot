const express = require('express');
const router = express.Router();



// ROUTES FOR USERS

// USER LOGIN ROUTE
router.get('/login', (req, res) => {
  res.send('login');
});

// USER REGISTER ROUTE
router.get('/register', (req, res) => {
  res.send('register');
});


module.exports = router;