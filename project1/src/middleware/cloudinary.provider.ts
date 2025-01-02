import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: ()=> {
    return v2.config({
        cloud_name: 'nestjs',
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET_KEY,
    });
  },
};