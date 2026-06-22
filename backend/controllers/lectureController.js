const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Enrollment = require('../models/Enrollment');
const { uploadVideo, deleteResource } = require('../utils/cloudinaryUpload');
const { cloudinary } = require('../config/cloudinary');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Get lectures for a course (curriculum view)
// @route   GET /api/v1/courses/:id/lectures
// @access  Private (Auth required)
exports.getLectures = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if the user is the instructor who created the course or an admin
    const isCreator = req.user && (course.instructor.toString() === req.user._id.toString() || req.user.role === 'admin');

    // Check if the user is enrolled in the course
    let isEnrolled = false;
    if (req.user && req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
        status: 'active',
      });
      if (enrollment) isEnrolled = true;
    }

    // Fetch lectures sorted by order
    const lectures = await Lecture.find({ course: courseId }).sort('order');

    // Map lectures. If not enrolled/creator, scrub video URLs for non-free lectures
    const curriculum = lectures.map((lecture) => {
      const lectureObj = lecture.toObject();
      if (!isCreator && !isEnrolled && !lecture.isFree) {
        // Strip out the actual video location and publicId for privacy
        lectureObj.videoUrl = '';
        lectureObj.publicId = '';
      }
      return lectureObj;
    });

    res.status(200).json({
      success: true,
      count: curriculum.length,
      data: {
        lectures: curriculum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload lecture + video
// @route   POST /api/v1/courses/:id/lectures
// @access  Private (Instructor only)
exports.createLecture = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, description, isFree } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check course owner
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add lectures to this course',
      });
    }

    // Verify video file is present
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a lecture video',
      });
    }

    // 1. Upload video to Cloudinary
    console.log(`Uploading lecture video to Cloudinary for course: ${course.title}...`);
    const uploadResult = await uploadVideo(req.file.buffer, `kgp-lms/courses/${courseId}`);
    console.log(`Video upload complete! URL: ${uploadResult.secure_url}`);

    // Determine sequence order (auto-increment if not specified)
    const existingLecturesCount = await Lecture.countDocuments({ course: courseId });
    const order = req.body.order || existingLecturesCount + 1;

    // 2. Create lecture document
    const lecture = await Lecture.create({
      course: courseId,
      title,
      description: description || '',
      videoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      duration: uploadResult.duration, // in seconds
      order,
      isFree: isFree === 'true' || isFree === true,
    });

    // 3. Add lecture to course lectures list
    course.lectures.push(lecture._id);
    // Recalculate total course duration in minutes
    course.duration = Math.round((course.duration || 0) + uploadResult.duration / 60);
    await course.save();

    // 4. Notify all enrolled students about new lecture
    const enrollments = await Enrollment.find({ course: courseId, status: 'active' });
    for (const enrollment of enrollments) {
      await createNotification(
        enrollment.student,
        'new_lecture',
        'New Lecture Uploaded',
        `A new lecture "${lecture.title}" has been uploaded to the course: ${course.title}`
      );
    }

    res.status(201).json({
      success: true,
      data: {
        lecture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lecture details
// @route   PUT /api/v1/lectures/:lectureId
// @access  Private (Instructor only)
exports.updateLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    let lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    // Verify course owner
    const course = await Course.findById(lecture.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this lecture',
      });
    }

    // If new video uploaded, handle replacement
    if (req.file) {
      console.log(`Replacing lecture video in Cloudinary...`);
      // Delete old video
      if (lecture.publicId) {
        await deleteResource(lecture.publicId, 'video');
      }
      
      // Upload new video
      const uploadResult = await uploadVideo(req.file.buffer, `kgp-lms/courses/${course._id}`);
      req.body.videoUrl = uploadResult.secure_url;
      req.body.publicId = uploadResult.public_id;
      
      // Adjust course duration
      const oldDurationMin = lecture.duration / 60;
      const newDurationMin = uploadResult.duration / 60;
      course.duration = Math.max(0, Math.round(course.duration - oldDurationMin + newDurationMin));
      await course.save();

      req.body.duration = uploadResult.duration;
    }

    // Update lecture fields
    lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        lecture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lecture
// @route   DELETE /api/v1/lectures/:lectureId
// @access  Private (Instructor only)
exports.deleteLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    // Verify course owner
    const course = await Course.findById(lecture.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this lecture',
      });
    }

    // 1. Delete video from Cloudinary
    if (lecture.publicId) {
      await deleteResource(lecture.publicId, 'video');
    }

    // 2. Remove lecture reference from course lectures list
    course.lectures = course.lectures.filter((id) => id.toString() !== lectureId);
    course.duration = Math.max(0, Math.round(course.duration - lecture.duration / 60));
    await course.save();

    // 3. Delete lecture document from DB
    await Lecture.findByIdAndDelete(lectureId);

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get signed Cloudinary streaming URL for a lecture
// @route   GET /api/v1/lectures/:lectureId/stream
// @access  Private (Enrolled students / creators only)
exports.streamLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    const course = await Course.findById(lecture.course);
    
    // Check if creator/admin
    const isCreator = req.user && (course.instructor.toString() === req.user._id.toString() || req.user.role === 'admin');

    // Check if student enrolled
    let isEnrolled = false;
    if (req.user && req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
        status: 'active',
      });
      if (enrollment) isEnrolled = true;
    }

    // Access check: must be free lecture, course creator, or enrolled student
    if (!lecture.isFree && !isCreator && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must enroll in the course to view this lecture.',
      });
    }

    // Generate signed URL (valid for 1 hour)
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const signedUrl = cloudinary.url(lecture.publicId, {
      resource_type: 'video',
      sign_url: true,
      expires_at: expiresAt,
    });

    res.status(200).json({
      success: true,
      data: {
        streamUrl: signedUrl,
        expiresAt: new Date(expiresAt * 1000).toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
