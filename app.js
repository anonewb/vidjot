const express  = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const methodOverride = require('method-override');


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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));





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

// EDIT IDEA FORM ROUTE
app.get('/ideas/edit/:id', (req, res) => { // ':id' is a parameter OR placeholder which is diff
  // EDITING THE particular IDEA using id
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
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


// EDIT FORM PROCESS
app.put('/ideas/:id', (req, res) => {
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
        res.redirect('/ideas');
      })
  });
});
//** we cant just change the method="put" in form to update changes. 
// So we have to dl "method-override" module 
// 2 ways to implement: using header or query-value
// other option is to use AJAX.


// ABOUT ROUTE
app.get('/about', (req, res) => {
  // res.send('ABOUT');
  res.render('about');
});


// DELETE ROUTE
app.delete('/ideas/:id', (req, res) => {
  // res.send('del');
  Idea.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas');
    });
});


// LISTENING TO PORT 5000

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});