import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { ROLE, User } from 'src/database/entities/user.entity';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import { Readable } from 'stream';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          console.log('Upload Error:', error);
          reject(error); // Reject the promise on error
        } else {
          console.log('Upload Success:', result);
          resolve(result); // Resolve the promise on success
        }
      });
      // Pipe the file buffer to the upload stream
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(upload);
    });
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(role?:ROLE): Promise<User[]> {
    if (role) {
      const users = await this.userRepository.find({ where: { role } });
      if (users.length === 0) {
        throw new NotFoundException(`No users with role ${role} found`);
      }
      return users;
    }
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(userDto:createUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10); 
    const user = this.userRepository.create({ ...userDto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async update(id: number, updatedUser: updateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } }); 
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUserEntity = { ...user, ...updatedUser };
    return this.userRepository.save(updatedUserEntity); 
  }
  async delete(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }

}
