const express = require('express');
const router = express.Router({ mergeParams: true });
const Movie = require('../models/movie');
const Actor = require('../models/actor');
const User = require('../models/user');

//  INDEX - GET - /actors
//  NEW - GET - /actors/new
//  DELETE - DELETE - /actors/:actorId
//  UPDATE - PUT - /actors/:actorId
//  CREATE - POST - /actors/
//  EDIT - GET - /actors/:actorId/edit
//  SHOW - GET - /actors/:actorId







module.exports = router;