const express = require('express');
const router = express.Router({ mergeParams: true });
const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Review = require('../models/review');
const User = require('../models/user');

// ** INDEX - GET - /movies
// ** NEW - GET - /movies/new
// ** DELETE - DELETE - /movies/:movieId
// ** UPDATE - PUT - /movies/:movieId
// ** CREATE - POST - /movies/
// ** EDIT - GET - /movies/:movieId/edit
// ** SHOW - GET - /movies/:movieId

//  INDEX - GET - /movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.render('movies/index.ejs', { movies });
  } catch (error) {
    console.log(error);

    res.status(500).json({ errMessage: error.message })
  }
});

//  NEW - GET - /movies/new
router.get('/new', async (req, res) => {
  try {
    const actors = await Actor.find({});
    res.render('movies/new.ejs', { actors });
  } catch (error) {
    console.log(error);

    res.status(500).json({ errMessage: error.message })
  }
});

//  DELETE - DELETE - /movies/:movieId
router.delete('/:movieId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }

    await Movie.findByIdAndDelete(req.params.movieId);

    res.redirect('/movies');
  } catch (error) {
    console.log(error);

    res.status(500).json({ errMessage: error.message })
  }
})

//  UPDATE - PUT - /movies/:movieId
router.put('/:movieId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }
    req.body.year = parseInt(req.body.year);
    req.body.cast = [].concat(req.body.cast || []);
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true });
    res.redirect(`/movies/${updatedMovie._id}`);
  } catch (error) {
    console.log(error);

    res.status(500).json({ errMessage: error.message })
  }
});

//  CREATE - POST - /movies
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }
    req.body.year = parseInt(req.body.year);
    req.body.addedBy = user._id;
    req.body.cast = [].concat(req.body.cast || []);
    const newMovie = await Movie.create(req.body);
    res.redirect(`/movies/${newMovie._id}`);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ errMessage: error.message })
  }
});

//  EDIT - GET - /movies/:movieId/edit
router.get('/:movieId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }
    const movie = await Movie.findById(req.params.movieId);
    const actors = await Actor.find({});
    res.render('movies/edit.ejs', { movie, actors });
  } catch (error) {
    console.log(error);

    res.status(500).json({ errMessage: error.message })    
  }
});

//  SHOW - GET - /movies/:movieId
router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    const addByUser = await User.findById(movie.addedBy);
    const actor = await Actor.find({ movies: movie._id });
    const reviews = await Review.find({ movie: movie._id }).populate('author');
    res.render('movies/show.ejs', { movie, addByUser, actor, reviews });
  } catch (error) {
    console.log(error);

    res.status(500).json({ errMessage: error.message })
  }
});


module.exports = router;