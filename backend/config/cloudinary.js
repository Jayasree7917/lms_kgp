const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: dde4z4jkx,
  api_key: 761715482974473,
  api_secret: dc9-oiN_rY4oh7csZtvDlCF34e4,
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
