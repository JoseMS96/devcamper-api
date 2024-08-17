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
const advancedResults = require('../middleware/advancedResults');

// Inclui router de outros recursos
const courseRouter = require('./courses');

const router = express.Router();

// Redireciona a router de outro recurso
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/') // Middleware Design: The Express framework is designed to automatically pass req, res, and next to all middleware functions.
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps) // Primeiro o express chama o método middleware advanced results e constrói a query lá dentro, depois ele chama o getBootcamps, nessa ordem
  .post(createBootcamp);

router // Se for só utilizar um tipo de request(get, put, etc), não é necessário utilizar o .route | Ex: router.post('/register', register);
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
