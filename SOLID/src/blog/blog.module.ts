import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { EmailModule } from 'src/email/email.module';
import { TechnicalBlogService } from './technical-blog.service';
import { TravelBlogService } from './travel-blog.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService, TechnicalBlogService, TravelBlogService],
})
export class BlogModule {}
