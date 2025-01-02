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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('role') role?: 'ADMIN' | 'CUSTOMER') {
    return this.userService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
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

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) userUpdate: updateUserDto) {
    return this.userService.update(id, userUpdate);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
