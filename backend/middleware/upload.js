const multer = require('multer');

// Configure memory storage (files are stored in memory buffers)
const storage = multer.memoryStorage();

// File filter to restrict uploads to images and videos
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// Multer upload middleware config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // We handle custom size checks per controller for better error reporting,
    // but set a general safety limit of 500MB (500 * 1024 * 1024 bytes)
    fileSize: 500 * 1024 * 1024,
  },
});

module.exports = upload;
