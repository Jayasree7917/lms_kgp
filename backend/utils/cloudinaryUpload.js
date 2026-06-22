// ─────────────────────────────────────────────────────────────────────────────
//  KGP LMS — Cloudinary Upload Utility
//  Phase 4 will implement uploadVideo(), uploadImage(), deleteResource()
// ─────────────────────────────────────────────────────────────────────────────

const { cloudinary } = require('../config/cloudinary');

/**
 * Upload a video buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<{secure_url, public_id, duration}>}
 */
const uploadVideo = (buffer, folder) => {
  if (process.env.MOCK_CLOUDINARY === 'true') {
    return Promise.resolve({
      secure_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
      public_id: 'kgp-lms/courses/mock-video-id',
      duration: 120, // 2 minutes (120 seconds)
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder,
        chunk_size: 6000000, // 6MB chunks for large videos
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          duration: Math.round(result.duration || 0),
        });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Upload an image buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<{secure_url, public_id}>}
 */
const uploadImage = (buffer, folder) => {
  if (process.env.MOCK_CLOUDINARY === 'true') {
    return Promise.resolve({
      secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      public_id: 'kgp-lms/thumbnails/mock-image-id',
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete a resource from Cloudinary by public_id
 * @param {string} publicId - Cloudinary public_id
 * @param {'image'|'video'} resourceType
 */
const deleteResource = async (publicId, resourceType = 'image') => {
  if (process.env.MOCK_CLOUDINARY === 'true') {
    return Promise.resolve();
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Failed to delete Cloudinary resource ${publicId}:`, error.message);
  }
};

module.exports = { uploadVideo, uploadImage, deleteResource };
