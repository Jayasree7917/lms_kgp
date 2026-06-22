const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (val) {
        return val.length === 4;
      },
      message: 'A question must have exactly 4 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required (0-3)'],
    min: [0, 'Correct answer index must be at least 0'],
    max: [3, 'Correct answer index cannot exceed 3'],
  },
});

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    type: [Number],
    required: true,
  },
  score: {
    type: Number,
    required: true, // Percentage (0-100)
  },
  passed: {
    type: Boolean,
    required: true,
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'An assessment must belong to a course'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      required: true,
      default: 60, // Percentage (e.g. 60%)
      min: 0,
      max: 100,
    },
    attempts: {
      type: Number,
      required: true,
      default: 3, // Max attempts allowed
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    submissions: [submissionSchema],
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
