const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const { MongoStore } = require("connect-mongo");
const path = require('path');

const authRequired = require('./middleware/isUserAuthorized')
const passDataToView = require('./middleware/passDataToView')


const authController = require('./controllers/auth.js');
const moviesController = require('./controllers/movies.js');
const actorsController = require('./controllers/actors.js');

const port = process.env.PORT ? process.env.PORT : '3000';


require('./db/connection')
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.set('view engine', 'ejs') // When this is present we dont need .ejs in our res.renders
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passDataToView);

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.use('/auth', authController);
app.use('/movies', moviesController);
app.use('/actors', actorsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
