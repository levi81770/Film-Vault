const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Review = require('../models/review');
const authRequired = require("../middleware/isUserAuthorized");

// My Profile Route
// GET  /users/me
router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.render("users/profile", { user });
});

// User Contributions Route
// GET /users/:userId/contributions
router.get("/:userId/contributions", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const movies = await Movie.find({ addedBy: user._id });
    const actors = await Actor.find({ addedBy: user._id });
    const reviews = await Review.find({ author: user._id }).populate('movie');
    res.render("users/contributions", { user, movies, actors, reviews });
  } catch (error) {

    console.log(error.message);
    

    res.status(500).json({ errMessage: error.message })
  }
});

module.exports = router;
