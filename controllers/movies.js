const express = require('express');
const router = express.Router({ mergeParams: true });
const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Review = require('../models/review');
const User = require('../models/user');

// ** INDEX - GET - /movies
// ** NEW - GET - /movies/new
// ** DELETE - DELETE - /movies/:movieId
// ** DELETE - DELETE - /movies/:movieId/reviews/:reviewId
// ** UPDATE - PUT - /movies/:movieId
// ** CREATE - POST - /movies/
// ** CREATE - POST - /movies/:movieId/reviews
// ** EDIT - GET - /movies/:movieId/edit
// ** SHOW - GET - /movies/:movieId


//  INDEX - GET - /movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.render('movies/index.ejs', { movies });
  } catch (error) {
    res.status(500).json({ errMessage: error.message })
  }
});

//  NEW - GET - /movies/new
router.get('/new', async (req, res) => {
  try {
    const actors = await Actor.find({});
    res.render('movies/new.ejs', { actors });
  } catch (error) {
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

    const movie = await Movie.findById(req.params.movieId);
    if (movie.addedBy.toString() !== req.session.user._id.toString()) {
      return res.status(404).json({ errMessage: 'Not authorized' });
    }
    await Movie.findByIdAndDelete(req.params.movieId);
    await Review.deleteMany({ movie: req.params.movieId });
    res.redirect('/movies');
  } catch (error) {
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

    const movie = await Movie.findById(req.params.movieId);
    if (movie.addedBy.toString() !== req.session.user._id.toString()) {
      return res.status(404).json({ errMessage: 'Not authorized' });
    }

    req.body.year = parseInt(req.body.year);
    req.body.cast = [].concat(req.body.cast || []);

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true });
    res.redirect(`/movies/${updatedMovie._id}`);
  } catch (error) {
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
    res.status(500).json({ errMessage: error.message })
  }
});

//  CREATE - POST - /movies/movieId/reviews
router.post('/:movieId/reviews', async (req, res) => {
  try {
    req.body.author = req.session.user._id;
    req.body.movie = req.params.movieId;
    await Review.create(req.body);
    res.redirect(`/movies/${req.params.movieId}`);
  } catch (error) {
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
    res.status(500).json({ errMessage: error.message })    
  }
});

//  SHOW - GET - /movies/:movieId
router.get('/:movieId', async (req, res) => {
  try {
    const user = req.session.user ? await User.findById(req.session.user._id) : null;
    const movie = await Movie.findById(req.params.movieId)
      .populate('addedBy')
      .populate('cast');
    const reviews = await Review.find({ movie: movie._id }).populate('author');
    res.render('movies/show.ejs', { movie, reviews, user });
  } catch (error) {
    res.status(500).json({ errMessage: error.message })
  }
});

//  DELETE - DELETE - /movies/:movieId/reviews/:reviewId
router.delete('/:movieId/reviews/:reviewId', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (review && review.author.toString() !== req.session.user._id.toString()) {
      return res.status(404).json({ errMessage: 'Review not found.' });
    }
    res.redirect(`/movies/${req.params.movieId}`);
  } catch (error) {
    res.status(500).json({ errMessage: error.message })
  }
});


module.exports = router;