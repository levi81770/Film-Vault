const express = require('express');
const router = express.Router({ mergeParams: true });
const Actor = require('../models/actor');
const Movie = require('../models/movie');
const User = require('../models/user');

// ** INDEX - GET - /actors
// ** NEW - GET - /actors/new
// ** DELETE - DELETE - /actors/:actorId
// ** UPDATE - PUT - /actors/:actorId
// ** CREATE - POST - /actors/
// ** EDIT - GET - /actors/:actorId/edit
// ** SHOW - GET - /actors/:actorId


//  INDEX - GET - /actors
router.get('/', async (req, res) => {
  try {
    const actors = await Actor.find({});
    res.render('actors/index.ejs', { actors });
  } catch (error) {
    res.status(500).json({ errMessage: error.message })
  }
});

//  NEW - GET - /actors/new
router.get('/new',  (req, res) => {
  res.render('actors/new.ejs');
});

//  DELETE - DELETE - /actors/:actorId
router.delete('/:actorId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }

    await Actor.findByIdAndDelete(req.params.actorId);

    res.redirect('/actors');
  } catch (error) {
    res.status(500).json({ errMessage: error.message })
  }
})

//  UPDATE - PUT - /actors/:actorId
router.put('/:actorId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }
    req.body.birthYear = parseInt(req.body.birthYear);
    req.body.movies = [].concat(req.body.movies || []);

    console.log(req.body);
    

    const updatedActor = await Actor.findByIdAndUpdate(req.params.actorId, req.body, { new: true });

    res.redirect(`/actors/${updatedActor._id}`);
  } catch (error) {
    res.status(500).json({ errMessage: error.message })
  }

});

//  CREATE - POST - /actors/
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }
    req.body.addedBy = user._id;
    req.body.birthYear = parseInt(req.body.birthYear);
    req.body.movies = [].concat(req.body.movies || []);
    const newActor = await Actor.create(req.body);
    res.redirect('/actors');
  } catch (error) {
    res.status(500).json({ errMessage: error.message });
  }
});

//  EDIT - GET - /actors/:actorId/edit
router.get('/:actorId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ errMessage: 'You must be signed in to add a movie.' });
    }
    const actor = await Actor.findById(req.params.actorId);
    res.render('actors/edit.ejs', { actor });
  } catch (error) {
    res.status(500).json({ errMessage: error.message });
  }
});

//  SHOW - GET - /actors/:actorId
router.get('/:actorId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const actor = await Actor.findById(req.params.actorId).populate('addedBy');
    const movies = await Movie.find({ cast: actor._id });
    res.render('actors/show.ejs', { user, actor, movies });
  } catch (error) {
    res.status(500).json({ errMessage: error.message });
  }
});




module.exports = router;