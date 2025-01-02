import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: ()=> {
    return v2.config({
        cloud_name: 'nestjs',
      api_key: '721886436253255',
      api_secret: 'a02dbZGM0lLhDze654hELvdA8UE',
    });
  },
};