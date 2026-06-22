const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { isStudent } = require('../middleware/roleCheck');

// Public route to browse course reviews
router.get('/courses/:id/reviews', reviewController.getCourseReviews);

// Protected routes (Require login)
router.use(protect);

router.post('/courses/:id/reviews', isStudent, reviewController.createReview);
router.put('/reviews/:id', isStudent, reviewController.updateReview);
router.delete('/reviews/:id', isStudent, reviewController.deleteReview);

module.exports = router;
