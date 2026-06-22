const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');
const { isStudent, isInstructor } = require('../middleware/roleCheck');

// All enrollment routes require authentication
router.use(protect);

// Student-specific routes
router.post('/courses/:id/enroll', isStudent, enrollmentController.enrollInCourse);
router.get('/enrollments/my', isStudent, enrollmentController.getMyEnrollments);
router.put('/enrollments/:id/progress', isStudent, enrollmentController.updateProgress);
router.delete('/enrollments/:id', isStudent, enrollmentController.dropCourse);

// Instructor-specific course enrollment view route
router.get('/courses/:id/enrollments', isInstructor, enrollmentController.getCourseEnrollments);

module.exports = router;
