const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validators');

router.post('/', authenticate, authorize('user'), ratingValidation, ratingController.submitRating);

module.exports = router;
