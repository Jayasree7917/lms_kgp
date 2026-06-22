const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'A lecture must belong to a course'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'A lecture must have a title'],
      trim: true,
      minlength: [3, 'Lecture title must have at least 3 characters'],
      maxlength: [200, 'Lecture title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Lecture description cannot exceed 1000 characters'],
    },
    videoUrl: {
      type: String,
      required: [true, 'A lecture must have a video URL'],
    },
    publicId: {
      type: String,
      required: [true, 'A lecture must have a Cloudinary public ID'],
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    order: {
      type: Number,
      required: [true, 'A lecture must have a sequence order'],
    },
    isFree: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for course and order to facilitate quick curriculum sorting
lectureSchema.index({ course: 1, order: 1 });

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
