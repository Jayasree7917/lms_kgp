const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS for asset URLs
});

// Verify config is set on startup
const verifyCloudinaryConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    console.error('❌ Cloudinary config is incomplete. Check your .env file.');
    process.exit(1);
  }
  console.log(`✅ Cloudinary configured: cloud "${cloud_name}"`);
};

module.exports = { cloudinary, verifyCloudinaryConfig };
