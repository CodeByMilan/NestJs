
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

export class ImageUploadService{
    constructor(){}
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          console.log('Upload Error:', error);
          reject(error);
        } else if (result) {
            resolve(result); 
          } else {
            reject(new Error('Unexpected error: Upload result is undefined.'));
          }
        });
      // Pipe the file buffer to the upload stream
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(upload);
    });
  }
}
