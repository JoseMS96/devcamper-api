const express = require('express');

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

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Redireciona a router de outro recurso
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/') // Middleware Design: The Express framework is designed to automatically pass req, res, and next to all middleware functions.
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps) // Primeiro o express chama o método middleware advanced results e constrói a query lá dentro, depois ele chama o getBootcamps, nessa ordem
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router // Se for só utilizar um tipo de request(get, put, etc), não é necessário utilizar o .route | Ex: router.post('/register', register);
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
