import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { CloudinaryProvider } from 'src/middleware/cloudinary.provider';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
import { UserAuthenticationService } from 'src/auth/userAuthentication.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminSeederService } from 'src/seeder/adminSeeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule
  ],
  controllers: [UserController],
  providers: [CloudinaryProvider, UserService,UserAuthenticationService,AdminSeederService],
})
export class UserModule {}
