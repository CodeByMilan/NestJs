import { Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practice } from './entities/practice.entity';
import { Hobbies } from './entities/hobbies.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Practice,Hobbies])],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports:[PracticeService]
})
export class PracticeModule {}
