import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

import { logInDto } from './dto/login-user.dto';
import { UserAuthenticationService } from 'src/auth/userAuthentication.service';
import { AuthGuard, AuthRequest } from 'src/auth/authGuard';
import { ROLE } from 'src/database/entities/user.entity';
import { RolesGuard } from 'src/auth/rolesGuard';
import { Roles } from 'src/custom/roles.decorator';
import { Public } from 'src/custom/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Authenticated } from 'src/auth/authenticated';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TwilioService } from 'src/utils/twilio/twilioService';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  SmsRetunedDto,
  SmsSendDto,
  VerifyOtpDto,
} from 'src/utils/twilio/smsTypes.dto';
@ApiTags('user')
@Controller('user')
@Authenticated()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: UserAuthenticationService,
    private readonly twilioService: TwilioService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  @Post('register')
  @Public()
  @Render('mailTemplate')
  async registerUser(@Body(ValidationPipe) user: createUserDto) {
    try {
      const data = await this.userService.registerUser(user);
      return {
        message: 'User created successfully',
        userData: data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Roles(ROLE.ADMIN)
  @Get('havingOrders')
  async getUsersHavingOrders()
  {
    const users = await this.userService.getUsersWithOrders();
    return users;
  }
  @Roles(ROLE.ADMIN)
  @Get()
  async getAllUsers(@Query('role') role?: ROLE) {
    const data = await this.userService.getAllUsers(role);
    console.log(data);
    return {
      message: 'data of all users Fetched successfully',
      data,
    };
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token?: string,
  ): Promise< string > {
    console.log('Token in controller:', token);
    try {
      const message = await this.userService.verifyEmailToken(token);
      return message ;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  @Roles(ROLE.ADMIN, ROLE.CUSTOMER)
  @Get(':id')
  getSingleUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;
    if (userId === id) {
      return this.userService.getSingleUser(id);
    }
    return {
      message: 'You are not authorized to access this user',
    };
  }

  @Roles(ROLE.ADMIN, ROLE.CUSTOMER)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) userUpdate: updateUserDto,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;
    let data;
    if (userId === id) {
      data = this.userService.updateUser(id, userUpdate);
    }
    return {
      message: 'You are not authorized to update this user',
      data,
    };
  }

  @Roles(ROLE.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    const data = this.userService.deleteUser(id);
    return {
      message: 'User deleted successfully',
      data,
    };
  }

  //login route
  @Public()
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: logInDto) {
    try {
      const token = await this.authService.login(loginDto);
      return { accessToken: token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
 
  @Post('send-otp')
  async sendOtp(
    @Body() body: SmsSendDto,
  ): Promise<{ message: string; returnedData: SmsRetunedDto }> {
    const otp = await this.twilioService.generateOtp(6);
    const returnedData = await this.twilioService.sendOtp(
      body.phoneNumber,
      otp,
    );
    return {
      message: 'OTP sent successfully',
      returnedData,
    };
  }

  // Endpoint to verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto): Promise<{ message: string }> {
    await this.twilioService.verifyOtp(body);
    return {
      message: 'OTP verified successfully',
    };
  }


  
  

}
