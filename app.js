const express  = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const app = express();



// Connect to mongoose
// db could be local or remote using mlab
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected..'))
  .catch((err) => console.log(err));

// Load Idea modal
require('./models/Idea');
const Idea = mongoose.model('ideas');

// MIDDLEWARES

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// INDEX ROUTE
app.get('/', (req, res) => {
  const title = 'Welcome';
  // res.send('INDEX');
  res.render('index', {
    title: title
  });
});



// ROUTING

// ADD IDEA FORM ROUTE
app.get('/ideas/add', (req, res) => {
  // ADDING IDEAS USING FORM
  res.render('ideas/add');
});

// POSTING, PROCESSING AND SAVING IDEA TO MONGODB
app.post('/ideas', (req, res) => {
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
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    // res.send('passed');
    // IF VALID, THEN CREATE NEW IDEA AND SAVE IT TO MONGODB
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
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
app.get('/ideas', (req, res) => {
  // FETCHING IDEAS FROM MONGODB
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      // RENDERING ALL THE IDEAS
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});




// ABOUT ROUTE
app.get('/about', (req, res) => {
  // res.send('ABOUT');
  res.render('about');
});





// LISTENING TO PORT 5000

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});