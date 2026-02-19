// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'dsgxixoaa',
  api_key: '338444455899926',
  api_secret: 'KKKuZKZ36YHGcpQwwZ3PLSJQ2GI',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'clothes',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

export { cloudinary, upload };
