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
  findById(id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(role?:ROLE): Promise<User[]> {
    if (role) {
      const users = await this.userRepository.find({ where: { role } });
      if (users.length === 0) {
        throw new NotFoundException(`No users with role ${role} found`);
      }
      return users;
    }
    return this.userRepository.find();
  }

  async getSingleUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async registerUser(userDto:createUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10); 
    const user =  await this.userRepository.create({ ...userDto, password: hashedPassword });
    const data = await this.userRepository.save(user);
    console.log("user",data)
    return{
      ...data,
      password: undefined
    }
  }

  async updateUser(id: number, updatedUser: updateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } }); 
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUserEntity = { ...user, ...updatedUser };
    const data =await this.userRepository.save(updatedUserEntity); 
    return data ;
  }
  async deleteUser(id: number): Promise<User> {
    const user = await this.getSingleUser(id);
    await this.userRepository.delete(id);
    return user;
  }

}
