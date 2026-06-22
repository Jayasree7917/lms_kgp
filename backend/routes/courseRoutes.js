const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, protectOptional } = require('../middleware/auth');
const { isInstructor } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Public routes (can optionally identify user to support unpublished course author preview)
router.get('/', protectOptional, courseController.getAllCourses);
router.get('/:id', protectOptional, courseController.getCourseById);

// Protected routes (Instructor only)
router.post('/', protect, isInstructor, upload.single('thumbnail'), courseController.createCourse);
router.put('/:id', protect, isInstructor, upload.single('thumbnail'), courseController.updateCourse);
router.delete('/:id', protect, isInstructor, courseController.deleteCourse);
router.post('/:id/publish', protect, isInstructor, courseController.togglePublish);
router.get('/:id/analytics', protect, isInstructor, courseController.getCourseAnalytics);

module.exports = router;
