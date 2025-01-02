
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import * as multer from 'multer';
// import { diskStorage } from 'multer';
// import * as path from 'path';

// const storage = diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads'); 
//   },
//   filename: (req, file, cb) => {
//     const filename = `${Date.now()}-${file.originalname}`; 
//     cb(null, filename);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
//   }
// };

// // Image upload middleware
// @Injectable()
// export class MulterConfig implements NestMiddleware {
//   private upload = multer({ storage, fileFilter });

//   use(req: Request, res: Response, next: NextFunction) {
//     this.upload.single('image')(req, res, (err) => {
//       if (err) {
//         res.status(400).json({ message: err.message }); // Handle upload error
//       } else {
//         next(); // Continue to the next middleware or route handler
//       }
//     });
//   }
// }
