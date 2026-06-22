const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title'],
      trim: true,
      minlength: [5, 'Course title must have at least 5 characters'],
      maxlength: [150, 'Course title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'A course must have a description'],
      minlength: [20, 'Course description must have at least 20 characters'],
      maxlength: [2000, 'Course description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'A course must belong to a category'],
      enum: {
        values: [
          'Computer Science',
          'Data Science',
          'Web Development',
          'Machine Learning',
          'Cybersecurity',
          'Programming Languages',
          'Cloud Computing',
          'Design',
          'Video Editing',
          'Other',
        ],
        message: 'Invalid course category',
      },
    },
    difficulty: {
      type: String,
      required: [true, 'A course must have a difficulty level'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Difficulty must be Beginner, Intermediate, or Advanced',
      },
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A course must have an instructor'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'A course must have a price'],
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0.0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: Number,
      default: 0, // Total minutes (sum of lecture durations)
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for searching and filtering
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
