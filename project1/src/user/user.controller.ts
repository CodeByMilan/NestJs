import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

  @Get()
findAll(@Query('role')role?:'INTERN'|'ENGINEER'|'ADMIN') {
    return this.userService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() user: {name:string,email:string,role:'INTERN'|'ENGINEER'|'ADMIN'}) {
    return this.userService.create(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userUpadte: {name?:string,email?:string,role?:'INTERN'|'ENGINEER'|'ADMIN'}) {
    return this.userService.update(+id,userUpadte);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
