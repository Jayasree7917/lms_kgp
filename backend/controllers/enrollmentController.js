const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Lecture = require('../models/Lecture');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Enroll student in a course
// @route   POST /api/v1/courses/:id/enroll
// @access  Private (Student only)
exports.enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { studentId, phone, email, department, year, dob } = req.body;

    // Validate role
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can enroll in courses',
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if course is published
    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'You cannot enroll in an unpublished course',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'You are already enrolled in this course',
        });
      } else if (existingEnrollment.status === 'dropped') {
        // Re-enroll dropped student
        existingEnrollment.status = 'active';
        existingEnrollment.studentId = studentId;
        existingEnrollment.phone = phone;
        existingEnrollment.email = email;
        existingEnrollment.department = department;
        existingEnrollment.year = year;
        existingEnrollment.dob = new Date(dob);
        existingEnrollment.enrolledAt = Date.now();
        await existingEnrollment.save();

        // Increment enrollment count
        course.enrollmentCount += 1;
        await course.save();

        // Create re-enrollment notifications
        await createNotification(
          req.user._id,
          'enrollment',
          'Re-enrollment Confirmed',
          `You have successfully re-enrolled in the course: ${course.title}`
        );
        await createNotification(
          course.instructor,
          'enrollment',
          'Student Re-enrolled',
          `Student ${req.user.name} has re-enrolled in your course: ${course.title}`
        );

        return res.status(200).json({
          success: true,
          message: 'Successfully re-enrolled in the course',
          data: { enrollment: existingEnrollment },
        });
      }
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      studentId,
      phone,
      email,
      department,
      year,
      dob: new Date(dob),
    });

    // Add course to student's enrolled courses list
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Increment course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    // Create enrollment notifications
    await createNotification(
      req.user._id,
      'enrollment',
      'Enrollment Confirmed',
      `You have successfully enrolled in the course: ${course.title}`
    );
    await createNotification(
      course.instructor,
      'enrollment',
      'New Student Enrolled',
      `Student ${req.user.name} has enrolled in your course: ${course.title}`
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      data: {
        enrollment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my enrollments (student view)
// @route   GET /api/v1/enrollments/my
// @access  Private (Student only)
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: { $ne: 'dropped' },
    })
      .populate({
        path: 'course',
        select: 'title description category difficulty thumbnail price averageRating totalReviews duration',
        populate: {
          path: 'instructor',
          select: 'name avatar',
        },
      })
      .sort('-enrolledAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: {
        enrollments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all student enrollments in a course
// @route   GET /api/v1/courses/:id/enrollments
// @access  Private (Instructor owner only)
exports.getCourseEnrollments = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view enrollments for this course',
      });
    }

    const enrollments = await Enrollment.find({
      course: courseId,
      status: { $ne: 'dropped' },
    })
      .populate('student', 'name email avatar')
      .sort('-enrolledAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: {
        enrollments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress (mark lecture complete)
// @route   PUT /api/v1/enrollments/:id/progress
// @access  Private (Student owner only)
exports.updateProgress = async (req, res, next) => {
  try {
    const enrollmentId = req.params.id;
    const { lectureId } = req.body;

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a lecture ID',
      });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Verify student owner
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update progress for this enrollment',
      });
    }

    // Verify lecture belongs to this course
    const lecture = await Lecture.findOne({ _id: lectureId, course: enrollment.course });
    if (!lecture) {
      return res.status(400).json({
        success: false,
        message: 'This lecture does not belong to the enrolled course',
      });
    }

    // Add lecture to completedLectures if not already present
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
      
      // Calculate progress %
      const totalLecturesCount = await Lecture.countDocuments({ course: enrollment.course });
      enrollment.progress = Math.round(
        (enrollment.completedLectures.length / totalLecturesCount) * 100
      );

      // Auto-complete course check
      if (enrollment.progress === 100) {
        enrollment.status = 'completed';
        enrollment.completedAt = Date.now();

        // Create completion notification
        const course = await Course.findById(enrollment.course);
        if (course) {
          await createNotification(
            req.user._id,
            'general',
            'Course Completed! 🎓',
            `Congratulations! You have successfully completed the course: ${course.title}`
          );
        }
      }

      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      data: {
        progress: enrollment.progress,
        completedLectures: enrollment.completedLectures,
        status: enrollment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Drop course enrollment
// @route   DELETE /api/v1/enrollments/:id
// @access  Private (Student owner only)
exports.dropCourse = async (req, res, next) => {
  try {
    const enrollmentId = req.params.id;
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Verify student owner
    if (enrollment.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to drop this course',
      });
    }

    if (enrollment.status === 'dropped') {
      return res.status(400).json({
        success: false,
        message: 'Course is already dropped',
      });
    }

    // Mark enrollment as dropped
    enrollment.status = 'dropped';
    await enrollment.save();

    // Decrement course enrollment count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { enrollmentCount: -1 },
    });

    // Remove course from student enrolledCourses list
    await User.findByIdAndUpdate(enrollment.student, {
      $pull: { enrolledCourses: enrollment.course },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully dropped course',
    });
  } catch (error) {
    next(error);
  }
};
