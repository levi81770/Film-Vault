const mongoose = require('mongoose');

const movie = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Other'],
        required: true,
    },
    cast: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
    }],
    posterUrl: String,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Movie = mongoose.model('Movie', movie);

module.exports = Movie;