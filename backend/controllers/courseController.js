const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const { uploadImage, deleteResource } = require('../utils/cloudinaryUpload');

// @desc    Get all published courses (search, filter, paginate)
// @route   GET /api/v1/courses
// @access  Public
exports.getAllCourses = async (req, res, next) => {
  try {
    // 1. Build Query
    const queryObj = { isPublished: true };

    // Search filter (text search across title, description, tags)
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Difficulty filter
    if (req.query.difficulty) {
      queryObj.difficulty = req.query.difficulty;
    }

    // Let instructors see their own unpublished courses if requested
    if (req.query.myCourses === 'true' && req.user && req.user.role === 'instructor') {
      delete queryObj.isPublished;
      queryObj.instructor = req.user._id;
    }

    // 2. Execute Query with Pagination & Sorting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    let query = Course.find(queryObj)
      .populate('instructor', 'name avatar')
      .skip(skip)
      .limit(limit);

    // If searching, sort by relevance score
    if (req.query.search) {
      query = query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort('-createdAt');
    }

    const courses = await query;
    const total = await Course.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: courses.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
      },
      data: {
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email avatar')
      .populate({
        path: 'lectures',
        options: { sort: { order: 1 } },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Restriction check: if course is not published, only the instructor who created it can access it
    if (!course.isPublished) {
      // If user is not authenticated or not the course instructor, deny access
      if (!req.user || (course.instructor._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This course is not published yet.',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/v1/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, price, tags } = req.body;

    let thumbnailUrl = '';
    
    // Upload thumbnail if file exists
    if (req.file) {
      // Validate image size limit (5MB)
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Thumbnail image cannot exceed 5MB',
        });
      }
      
      const uploadResult = await uploadImage(req.file.buffer, 'kgp-lms/thumbnails');
      thumbnailUrl = uploadResult.secure_url;
    }

    // Process tags (accept either array or comma-separated string)
    let processedTags = [];
    if (tags) {
      processedTags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

    const course = await Course.create({
      title,
      description,
      category,
      difficulty,
      instructor: req.user._id,
      thumbnail: thumbnailUrl,
      price: price || 0,
      tags: processedTags,
    });

    res.status(201).json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private (Instructor owner only)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

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
        message: 'You are not authorized to update this course',
      });
    }

    // Handle thumbnail replacement if a new file is uploaded
    if (req.file) {
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Thumbnail image cannot exceed 5MB',
        });
      }

      // If course had a thumbnail, attempt deletion from Cloudinary
      if (course.thumbnail) {
        // Extract publicId from URL
        const urlParts = course.thumbnail.split('/');
        const filePart = urlParts[urlParts.length - 1];
        const publicId = `kgp-lms/thumbnails/${filePart.split('.')[0]}`;
        await deleteResource(publicId, 'image');
      }

      const uploadResult = await uploadImage(req.file.buffer, 'kgp-lms/thumbnails');
      req.body.thumbnail = uploadResult.secure_url;
    }

    // Process tags if provided
    if (req.body.tags) {
      req.body.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map(tag => tag.trim());
    }

    // Update course document
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (cascade delete lectures + Cloudinary files)
// @route   DELETE /api/v1/courses/:id
// @access  Private (Instructor owner only)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: 'You are not authorized to delete this course',
      });
    }

    // 1. Delete course thumbnail from Cloudinary
    if (course.thumbnail) {
      const urlParts = course.thumbnail.split('/');
      const filePart = urlParts[urlParts.length - 1];
      const publicId = `kgp-lms/thumbnails/${filePart.split('.')[0]}`;
      await deleteResource(publicId, 'image');
    }

    // 2. Fetch lectures of this course and delete videos from Cloudinary
    const lectures = await Lecture.find({ course: course._id });
    for (const lecture of lectures) {
      if (lecture.publicId) {
        await deleteResource(lecture.publicId, 'video');
      }
    }

    // 3. Delete lectures from DB
    await Lecture.deleteMany({ course: course._id });

    // 4. Delete course from DB
    await Course.findByIdAndDelete(course._id);

    // TODO: Phase 5 & 6 & 7 cascade deletion for enrollments, assessments, and reviews

    res.status(200).json({
      success: true,
      message: 'Course and all related lectures deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle course publication status
// @route   POST /api/v1/courses/:id/publish
// @access  Private (Instructor owner only)
exports.togglePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: 'You are not authorized to toggle publish status for this course',
      });
    }

    // Publish gate: A course must have at least 1 lecture before it can be published
    if (!course.isPublished && course.lectures.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Course must have at least one lecture upload before it can be published',
      });
    }

    // Toggle publish status
    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        isPublished: course.isPublished,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course analytics
// @route   GET /api/v1/courses/:id/analytics
// @access  Private (Instructor owner only)
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: 'You are not authorized to view analytics for this course',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        enrollmentCount: course.enrollmentCount,
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};
