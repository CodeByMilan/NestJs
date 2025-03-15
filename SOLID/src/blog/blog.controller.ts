import { Controller, Post, Get, Body } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async createBlog(@Body('title') title: string, @Body('content') content: string) {
    return this.blogService.createBlog(title, content);
  }

  @Get()
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }
}
