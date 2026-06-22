const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An enrollment must have a student reference'],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'An enrollment must refer to a course'],
      index: true,
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required for enrollment'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required for enrollment'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required for enrollment'],
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required for enrollment'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of study is required for enrollment'],
      enum: {
        values: ['1st', '2nd', '3rd', '4th', 'Alumni'],
        message: 'Year must be 1st, 2nd, 3rd, 4th, or Alumni',
      },
    },
    dob: {
      type: Date,
      required: [true, 'Date of Birth is required for enrollment'],
    },
    progress: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],
    status: {
      type: String,
      required: true,
      enum: {
        values: ['active', 'completed', 'dropped'],
        message: 'Status must be active, completed, or dropped',
      },
      default: 'active',
    },
    enrolledAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double enrollment: a student can only enroll in a course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
