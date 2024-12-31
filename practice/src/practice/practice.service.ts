import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { Practice } from './entities/practice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(Practice)
    private readonly practiceRepository: Repository<Practice>,
  ){}
  async create(createPracticeDto: CreatePracticeDto) {
    // const practiceData = new Practice()
    // practiceData.name=createPracticeDto.name
    // practiceData.email=createPracticeDto.email
    // practiceData.age=createPracticeDto.age
    // this.practiceRepository.save(practiceData)
    const practice = this.practiceRepository.create(createPracticeDto);
    return this.practiceRepository.save(practice);
  }

  findAll() {
    return this.practiceRepository.find();
  }

  async findOne(id: number) {
    const practice = await this.practiceRepository.findOne({where:{id}
    },);
    if (!practice) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
      }
      return practice;
  }

 async  update(id: number, updatePracticeDto: UpdatePracticeDto) {
    // await this.findOne(id) 
    // const practice = await this.practiceRepository.update(id, updatePracticeDto);
    // return practice

    const practice = await this.practiceRepository.preload(
      { id,
        ...updatePracticeDto,
       },
    )
    if (!practice) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
      }
      return this.practiceRepository.save(practice); 
   
  }

   async remove(id: number ) {
    const practice = await this.practiceRepository.findOne({where:{id}});
    if (!practice) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
      }
      return this.practiceRepository.remove(practice);
   
    }
}
