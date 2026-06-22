const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');
const { isStudent, isInstructor } = require('../middleware/roleCheck');

// All assessment routes require authentication
router.use(protect);

// Nested course assessment routes
router.post('/courses/:id/assessments', isInstructor, assessmentController.createAssessment);
router.get('/courses/:id/assessments', assessmentController.getAssessments);

// Direct quiz detail, submit, and results routes
router.put('/assessments/:id', isInstructor, assessmentController.updateAssessment);
router.post('/assessments/:id/submit', isStudent, assessmentController.submitAssessment);
router.get('/assessments/:id/results', isInstructor, assessmentController.getAssessmentResults);
router.get('/assessments/:id/my-results', isStudent, assessmentController.getMyResults);

module.exports = router;
