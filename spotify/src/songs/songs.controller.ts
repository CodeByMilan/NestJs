import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('songs')
export class SongsController {

  @Post()
  create(){
    return 'create new song'
  }

  @Get()
  findAll() {
    return 'find all songs';
  }

  @Get(':id')
  findOne() {
    return `find one song with with id `;
  }

  @Put(':id')
  update() {
    return 'update song';
  }
  @Delete(':id')
  delete(){
    return 'delete song'
  }
}
