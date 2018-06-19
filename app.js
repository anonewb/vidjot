const express  = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();



// Connect to mongoose
// db could be local or remote using mlab
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected..'))
  .catch((err) => console.log(err));

// Load Idea modal
require('./models/Idea');
const Idea = mongoose.model('ideas');


// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  // res.send('INDEX');
  res.render('index', {
    title: title
  });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// About Route
app.get('/about', (req, res) => {
  // res.send('ABOUT');
  res.render('about');
});


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});