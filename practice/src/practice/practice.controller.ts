import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { PracticeService } from './practice.service';
import { request, Response } from 'express';
 
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  async create(@Body() createPracticeDto: CreatePracticeDto){
    return  await this.practiceService.create(createPracticeDto);
  }
  @Get()
  findAll(){
    const data = this.practiceService.findAll();
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const data = this.practiceService.findOne(id);
    if(!data){
      throw new HttpException(`could not find data for the given ${id}`,HttpStatus.NOT_FOUND)
    } 
    return data;
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePracticeDto: UpdatePracticeDto,
  ) {
    const data = this.practiceService.findOne(id)
    if(!data){
      throw new HttpException(`could not find data for the given ${id}`,HttpStatus.NOT_FOUND)
      }
    return this.practiceService.update(id, updatePracticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    const data= this . practiceService.findOne(id)
    if(!data){
      throw new HttpException(`could not find data for the given ${id}`,HttpStatus.NOT_FOUND)
      }
    return this.practiceService.remove( id);
  }
}
