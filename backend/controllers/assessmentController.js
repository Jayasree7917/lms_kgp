const Assessment = require('../models/Assessment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Create quiz/assessment
// @route   POST /api/v1/courses/:id/assessments
// @access  Private (Instructor only)
exports.createAssessment = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, description, questions, passingScore, attempts, isPublished } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Owner check
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create assessments for this course',
      });
    }

    const assessment = await Assessment.create({
      course: courseId,
      title,
      description: description || '',
      questions,
      passingScore: passingScore || 60,
      attempts: attempts || 3,
      isPublished: isPublished === undefined ? true : isPublished,
    });

    // Notify enrolled students about new quiz
    const enrollments = await Enrollment.find({ course: courseId, status: 'active' });
    for (const enrollment of enrollments) {
      await createNotification(
        enrollment.student,
        'assessment_available',
        'New Quiz Available 📝',
        `A new quiz "${assessment.title}" is available in the course: ${course.title}`
      );
    }

    res.status(201).json({
      success: true,
      data: {
        assessment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessments for a course
// @route   GET /api/v1/courses/:id/assessments
// @access  Private (Auth required)
exports.getAssessments = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Access check: must be instructor creator or enrolled student
    const isCreator = req.user && (course.instructor.toString() === req.user._id.toString() || req.user.role === 'admin');

    if (!isCreator) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
        status: 'active',
      });
      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in this course to view assessments',
        });
      }
    }

    const assessments = await Assessment.find({ course: courseId });

    // If student, strip correct answers from questions payload to prevent cheating
    const processedAssessments = assessments.map((assessment) => {
      const assessObj = assessment.toObject();
      if (!isCreator) {
        assessObj.questions = assessObj.questions.map((q) => {
          delete q.correctAnswer;
          return q;
        });
        // Remove submissions list of other students
        delete assessObj.submissions;
      }
      return assessObj;
    });

    res.status(200).json({
      success: true,
      count: processedAssessments.length,
      data: {
        assessments: processedAssessments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assessment
// @route   PUT /api/v1/assessments/:id
// @access  Private (Instructor only)
exports.updateAssessment = async (req, res, next) => {
  try {
    let assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    const course = await Course.findById(assessment.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this assessment',
      });
    }

    assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        assessment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment answers & auto-grade
// @route   POST /api/v1/assessments/:id/submit
// @access  Private (Student only)
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const assessmentId = req.params.id;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array',
      });
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: assessment.course,
      status: 'active',
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be actively enrolled in the course to submit attempts',
      });
    }

    // Attempt limits check
    const previousAttempts = assessment.submissions.filter(
      (sub) => sub.student.toString() === req.user._id.toString()
    );
    const attemptNumber = previousAttempts.length + 1;

    if (attemptNumber > assessment.attempts) {
      return res.status(400).json({
        success: false,
        message: `You have reached the maximum allowed attempts (${assessment.attempts}) for this quiz`,
      });
    }

    // Auto grading logic
    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    if (totalQuestions === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assessment does not have any questions configured',
      });
    }

    assessment.questions.forEach((question, index) => {
      // Handle missing answer gracefully
      if (answers[index] !== undefined && answers[index] === question.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;

    // Record submission
    const submission = {
      student: req.user._id,
      answers,
      score,
      passed,
      attemptNumber,
      submittedAt: Date.now(),
    };

    assessment.submissions.push(submission);
    await assessment.save();

    // Create result notification
    await createNotification(
      req.user._id,
      'result',
      'Quiz Attempt Graded',
      `You scored ${score}% in the quiz "${assessment.title}". Status: ${passed ? 'PASSED' : 'FAILED'}.`
    );

    res.status(200).json({
      success: true,
      message: passed ? 'Congratulations! You passed the quiz.' : 'You did not meet the passing score. Try again!',
      data: {
        score,
        passed,
        passingScore: assessment.passingScore,
        correctCount,
        totalQuestions,
        attemptNumber,
        attemptsLeft: assessment.attempts - attemptNumber,
        correctAnswers: assessment.questions.map((q) => q.correctAnswer), // Return correct answer indices after submission
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment submissions (Instructor view)
// @route   GET /api/v1/assessments/:id/results
// @access  Private (Instructor only)
exports.getAssessmentResults = async (req, res, next) => {
  try {
    const assessmentId = req.params.id;
    const assessment = await Assessment.findById(assessmentId)
      .populate('submissions.student', 'name email avatar');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    const course = await Course.findById(assessment.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view results for this assessment',
      });
    }

    res.status(200).json({
      success: true,
      count: assessment.submissions.length,
      data: {
        submissions: assessment.submissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my attempts history for a quiz
// @route   GET /api/v1/assessments/:id/my-results
// @access  Private (Student only)
exports.getMyResults = async (req, res, next) => {
  try {
    const assessmentId = req.params.id;
    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Filter student's own attempts
    const myAttempts = assessment.submissions.filter(
      (sub) => sub.student.toString() === req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      count: myAttempts.length,
      data: {
        attempts: myAttempts,
      },
    });
  } catch (error) {
    next(error);
  }
};
