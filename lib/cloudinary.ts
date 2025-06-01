import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
 cloud_name: 'dwgctmoct', 
        api_key: '582889132268327', 
        api_secret: 'dhruv_bansal_api'
});

export default cloudinary;

// Client-side cloudinary config
export const cloudinaryConfig = {
  cloudName: 'dwgctmoct',
  uploadPreset: 'ml_default', // Create this in Cloudinary dashboard
};