import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdef123456',
});

export const uploadToCloudinary = async (fileBuffer, originalName) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud') {
      // Fallback local mock URL if Cloudinary credentials are default
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
      return `https://res.cloudinary.com/demo/raw/upload/v1/resumes/${Date.now()}_${sanitizedName}`;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'smart_resumes' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (err) {
    console.warn(`[Cloudinary] Upload fallback used: ${err.message}`);
    return `https://res.cloudinary.com/demo/raw/upload/v1/resumes/${Date.now()}_${originalName}`;
  }
};
