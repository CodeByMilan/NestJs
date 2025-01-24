import {
  Inject,
  Injectable,
  NotFoundException,
  Render,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { ROLE, User } from 'src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NodeMailerService } from 'src/utils/mail/nodeMailer.service';
import { SendMailDto } from 'src/utils/mail/mail.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CustomQueryService } from '../customQuery/queryBuilder';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly nodeMailerService: NodeMailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly customQuery: CustomQueryService,
  ) {}

  async getUsersWithOrders(): Promise<User[]> {
    return this.customQuery.findUserWithOrders();
  }

  async getAllUsers(role?: ROLE): Promise<User[]> {
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

  async registerUser(userDto: createUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    const data = await this.userRepository.save(user);
    // console.log("user",data)

    const verificationToken = uuidv4();

    await this.cacheManager.set(
      `emailVerification:${verificationToken}`,
      JSON.stringify({ email: user.email, userId: user.id }),
    );
    const verificationUrl = `${this.configService.get<string>('BASEURL')}/user/verify-email?token=${verificationToken}`;
    const mailOptions: SendMailDto = {
      to: [
        {
          name: data.userName,
          address: data.email,
        },
      ],
      subject: 'Welcome to our platform',
      placeholderReplacement: {
        userName: data.userName,
        verificationUrl,
      },
    };
    const sendMail = await this.nodeMailerService.sendMail(mailOptions);
    return {
      ...data,
      password: undefined,
    };
  }

  async updateUser(id: number, updatedUser: updateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUserEntity = { ...user, ...updatedUser };
    const data = await this.userRepository.save(updatedUserEntity);
    return data;
  }
  async deleteUser(id: number): Promise<User> {
    const user = await this.getSingleUser(id);
    await this.userRepository.delete(id);
    return user;
  }

  async verifyEmailToken(token: string): Promise<any> {
    // Check if the token exists in Redis
    const userData: any = await this.cacheManager.get(
      `emailVerification:${token}`,
    );
    if (!userData) {
      throw new Error('Invalid or expired token.');
    }
    const { email } = JSON.parse(userData);
    // Delete the token from Redis
    await this.cacheManager.del(`emailVerification:${token}`);
    return {
      message: `${email} verified successfully!`,
    };
  }

}

