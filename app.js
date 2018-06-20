const express  = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path'); //no req to install
const passport = require('passport');

const app = express();


// LOAD ROUTES
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);


// Connect to mongoose
// db could be local or remote using mlab
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected..'))
  .catch((err) => console.log(err));


// MIDDLEWARES

// This middleware sets the 'public' folder to express static folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//*** NOTE: BELOW MIDDLEWARE MUST ALWAYS BE PLACED BELOW THE SESSION MIDDLEWARE

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware 
app.use(flash());

// GLOBAL VARIABLES
app.use(function(req, res, next){
  // to display flash msg
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // 
  res.locals.user = req.user || null;
  next();
});




// INDEX ROUTE
app.get('/', (req, res) => {
  const title = 'Welcome';
  // res.send('INDEX');
  res.render('index', {
    title: title
  });
});



// ABOUT ROUTE
app.get('/about', (req, res) => {
  // res.send('ABOUT');
  res.render('about');
});





// ALWAYS PLACE THIS USE ROUTES MIDDLEWARE AT BOTTOM, TO AVOID BUGS

// USE ROUTES
app.use('/ideas', ideas); //in ideas route, prefix '/ideas' by default
app.use('/users', users);


// LISTENING TO PORT 5000

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});