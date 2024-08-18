const express = require('express');
const rateLimit = require('express-rate-limit');

const mapQuestLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs
  max: 25,
  message:
    'You have exceeded the 25 requests in 24 hours limit for the Geocoder. (Bootcamp Creation & GetBootcampInRadius)',
  headers: true,
});

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps'); // Traz os métodos do import para este arquivo js, usando destructuring

const Bootcamp = require('../models/Bootcamp');

// Inclui router de outros recursos
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Redireciona a router de outros recursos
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/') // Middleware Design: The Express framework is designed to automatically pass req, res, and next to all middleware functions.
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps) // Primeiro o express chama o método middleware advanced results e constrói a query lá dentro, depois ele chama o getBootcamps, nessa ordem
  .post(
    protect,
    authorize('publisher', 'admin'),
    mapQuestLimiter,
    createBootcamp
  );

router // Se for só utilizar um tipo de request(get, put, etc), não é necessário utilizar o .route | Ex: router.post('/register', register);
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
  .route('/radius/:zipcode/:distance')
  .get(mapQuestLimiter, getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
