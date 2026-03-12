const mongoose = require('mongoose');

const actor = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthYear: {
    type: Number,
    required: true,
  },
  photoUrl: String,
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Actor = mongoose.model('Actor', actor);

module.exports = Actor;