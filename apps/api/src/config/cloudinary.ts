import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary automatically picks up process.env.CLOUDINARY_URL
cloudinary.config(true);

export default cloudinary;
