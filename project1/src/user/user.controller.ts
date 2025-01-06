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
  UploadedFile,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

import { logInDto } from './dto/login-user.dto';
import { UserAuthenticationService } from 'src/auth/userAuthentication.service';
import { AuthGuard } from 'src/auth/authGuard';
import { ROLE } from 'src/database/entities/user.entity';
import { RolesGuard } from 'src/auth/rolesGuard';
import { Roles } from 'src/custom/roles.decorator';
import { Public } from 'src/custom/public.decorator';
@Controller('user')
@UseGuards(AuthGuard,RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService:UserAuthenticationService) {}
    @Post('register')
    @Public()
    async create(@Body(ValidationPipe) user: createUserDto) {
      try {
        const data = await this.userService.create(user); 
        console.log("hello",data);
        return{
          message: 'User created successfully',
          data
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
     
    }
@Roles(ROLE.ADMIN)
  @Get()
  findAll(@Query('role') role?: ROLE) {
    return this.userService.findAll(role);
  }

  @Roles(ROLE.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) userUpdate: updateUserDto) {
    return this.userService.update(id, userUpdate);
  }
@Roles(ROLE.ADMIN)
@UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
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