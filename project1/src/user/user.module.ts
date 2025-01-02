import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { CloudinaryProvider } from 'src/middleware/cloudinary.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'milan', 
    signOptions: { expiresIn: '1h' }, 
  }),],
  controllers: [UserController],
  providers: [CloudinaryProvider,UserService]
})
export class UserModule {}
