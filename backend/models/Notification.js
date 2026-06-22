const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification must have a type'],
      enum: {
        values: [
          'enrollment',
          'new_lecture',
          'assessment_available',
          'result',
          'general',
        ],
        message: 'Invalid notification type',
      },
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message'],
      trim: true,
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for query performance on unread notifications
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
