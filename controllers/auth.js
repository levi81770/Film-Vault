const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs', { message: "" });
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs', { message: "" });
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      throw new Error(`User with username ${req.body.username} already exist.`)    }
  
    // Username is not taken already!
    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error("Password and confirm password do not match")
    }
  
    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
  
    // All ready to create the new user!
    await User.create(req.body);
  
    res.redirect('/');
  } catch (error) {
    res.render('auth/sign-up.ejs', { message: error.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      throw new Error(`User with username ${req.body.username} does not exist. Please sign up.`)
    }
  
    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      throw new Error("Password Incorrect, please try again")
    }
  
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
  
    res.redirect('/');
  } catch (error) {
    res.render('auth/sign-in.ejs', { message: error.message });
  }
});

module.exports = router;
