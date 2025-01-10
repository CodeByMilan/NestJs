import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
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
@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: UserAuthenticationService,
  ) {}
  @Post('register')
  @Public()
  async registerUser(@Body(ValidationPipe) user: createUserDto) {
    try {
      const data = await this.userService.registerUser(user);
      console.log('hello', data);
      return {
        message: 'User created successfully',
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Roles(ROLE.ADMIN)
  @Get()
  getAllUsers(@Query('role') role?: ROLE) {
    const data = this.userService.getAllUsers(role);
    return{
      message:"data of all users Fetched successfully",
      data
    }
  }

  @Roles(ROLE.ADMIN, ROLE.CUSTOMER)
  @Get(':id')
  getSingleUser(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
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
      const data =this.userService.updateUser(id, userUpdate);
    }
    return {
      message: 'You are not authorized to update this user',
      data,
    };
  }

  @Roles(ROLE.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    const data =this.userService.deleteUser(id);
    return {
      message: 'User deleted successfully',
      data,
      };
  }

  //login route
  @Post('login')
  @Public()
  async login(@Body(ValidationPipe) loginDto: logInDto) {
    try {
      const token = await this.authService.login(loginDto);
      return { accessToken: token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
