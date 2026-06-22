const Notification = require('../models/Notification');

/**
 * Utility helper to create and save in-app notifications
 * @param {string|ObjectId} recipientId - Recipient user ID
 * @param {'enrollment'|'new_lecture'|'assessment_available'|'result'|'general'} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification content body
 * @param {string} [link] - Frontend route path to navigate to
 * @returns {Promise<Notification>}
 */
const createNotification = async (recipientId, type, title, message, link = '') => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      link,
    });
    return notification;
  } catch (error) {
    console.error(`🔴 Failed to create notification for ${recipientId}:`, error.message);
  }
};

module.exports = { createNotification };
