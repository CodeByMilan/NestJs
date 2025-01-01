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
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

  @Get()
findAll(@Query('role')role?:'INTERN'|'ENGINEER'|'ADMIN') {
    return this.userService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() user: createUserDto) {
    return this.userService.create(user);
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() userUpadte: updateUserDto) {
    return this.userService.update(id,userUpadte);
  }
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
