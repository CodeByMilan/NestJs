import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService:SongsService
  ){}

  @Post()
  create(@Body() createSongDTO: CreateSongDTO) {
  const results = this.songsService.create(createSongDTO);
  return results;
  }

  @Get()
  findAll() {
    return 'find all songs';
  }
  @Get(':id')
  findOne(
  @Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}),
  ) id: number,) {
  return `fetch song on the based on id ${typeof id}`;
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
