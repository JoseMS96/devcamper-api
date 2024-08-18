const express = require('express');

const { getReviews, getReview } = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description', // Quando popula a review com o bootcamp relacionado, traz somente o nome e descrição do bootcamp
  }),
  getReviews
);

router.route('/:id').get(getReview);

module.exports = router;
