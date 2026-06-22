const mongoose = require('mongoose');
const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper to recalculate course rating
const updateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].nRating,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0.0,
      totalReviews: 0,
    });
  }
};

// @desc    Create course review
// @route   POST /api/v1/courses/:id/reviews
// @access  Private (Student only)
exports.createReview = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { rating, review } = req.body;

    // Check if enrolled (Review Gate)
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: 'active',
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be actively enrolled in this course to leave a review',
      });
    }

    // Check for duplicate review
    const existingReview = await Review.findOne({
      course: courseId,
      student: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course',
      });
    }

    const reviewDoc = await Review.create({
      course: courseId,
      student: req.user._id,
      rating,
      review: review || '',
    });

    // Recalculate average rating
    await updateCourseRating(courseId);

    res.status(201).json({
      success: true,
      data: {
        review: reviewDoc,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a course
// @route   GET /api/v1/courses/:id/reviews
// @access  Public
exports.getCourseReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ course: req.params.id })
      .populate('student', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Review.countDocuments({ course: req.params.id });

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
      },
      data: {
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course review
// @route   PUT /api/v1/reviews/:id
// @access  Private (Student owner only)
exports.updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { rating, review } = req.body;

    let reviewDoc = await Review.findById(reviewId);
    if (!reviewDoc) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify owner
    if (reviewDoc.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this review',
      });
    }

    reviewDoc.rating = rating || reviewDoc.rating;
    reviewDoc.review = review || reviewDoc.review;
    await reviewDoc.save();

    // Recalculate average rating
    await updateCourseRating(reviewDoc.course);

    res.status(200).json({
      success: true,
      data: {
        review: reviewDoc,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course review
// @route   DELETE /api/v1/reviews/:id
// @access  Private (Student owner only)
exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const reviewDoc = await Review.findById(reviewId);

    if (!reviewDoc) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify owner
    if (reviewDoc.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review',
      });
    }

    const courseId = reviewDoc.course;
    await Review.findByIdAndDelete(reviewId);

    // Recalculate average rating
    await updateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
