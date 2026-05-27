import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export function uploadImageToCloudinary(buffer: Buffer, filename: string) {
  return new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sephyroath',
        resource_type: 'image',
        overwrite: false,
        use_filename: true,
        unique_filename: true,
        public_id: filename.replace(/\.[^/.]+$/, ''),
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload failed')); 
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(publicId: string) {
  return new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary delete failed'));
        resolve(result);
      }
    );
  });
}
