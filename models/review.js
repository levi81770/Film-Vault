const mongoose = require('mongoose');

const review = mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 500,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
});

const Review = mongoose.model('Review', review);

module.exports = Review;