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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { logInDto } from './dto/login-user.dto';
import { UserAuthenticationService } from 'src/auth/userAuthentication.service';
import { AuthGuard } from 'src/auth/authGuard';
import { ROLE } from 'src/database/entities/user.entity';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService:UserAuthenticationService) {}


    @Post('register')
    @UseInterceptors(FileInterceptor('image')) 
    async create(@Body(ValidationPipe) user: createUserDto, @UploadedFile() file: Express.Multer.File) {
      try {
        // console.log("hello",file)
        if (file) {
          // console.log("inside file")
          user.profileImage = file.originalname; 
        }
        const image = await this.userService.uploadImage(file);
        const data = this.userService.create(user); 
        return {data,image};
      } catch (error) {
        console.log(error);
        throw error;
      }
     
    }

  @Get()
  findAll(@Query('role') role?: ROLE) {
    return this.userService.findAll(role);
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) userUpdate: updateUserDto) {
    return this.userService.update(id, userUpdate);
  }
@UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

//login route
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
}