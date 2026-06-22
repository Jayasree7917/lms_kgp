const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to a course'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a student'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    review: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review text cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// One student can only review a course once
reviewSchema.index({ course: 1, student: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
