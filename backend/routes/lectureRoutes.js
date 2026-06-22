const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { protect } = require('../middleware/auth');
const { isInstructor } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Protected routes (Require login)
router.use(protect);

// Nested course lecture routes
router.get('/courses/:id/lectures', lectureController.getLectures);
router.post('/courses/:id/lectures', isInstructor, upload.single('video'), lectureController.createLecture);

// Direct lecture detail & stream routes
router.put('/lectures/:lectureId', isInstructor, upload.single('video'), lectureController.updateLecture);
router.delete('/lectures/:lectureId', isInstructor, lectureController.deleteLecture);
router.get('/lectures/:lectureId/stream', lectureController.streamLecture);

module.exports = router;
