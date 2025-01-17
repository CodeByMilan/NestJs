import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { CloudinaryProvider } from 'src/middleware/cloudinary.provider';
import { UserAuthenticationService } from 'src/auth/userAuthentication.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminSeederService } from 'src/seeder/adminSeeder';
import { NodeMailerService } from 'src/utils/mail/nodeMailer.service';
import { TwilioService } from 'src/utils/twilio/twilioService';
import { CustomQueryService } from '../customQuery/queryBuilder';
import { Order } from 'src/database/entities/order.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Order]),
    JwtModule
  ],
  controllers: [UserController],
  providers: [CloudinaryProvider, UserService,UserAuthenticationService,AdminSeederService,NodeMailerService,
    TwilioService,CustomQueryService],
})
export class UserModule {}