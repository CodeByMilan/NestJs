import { Controller, Post, Get, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { EmailService } from 'src/email/email.service';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async createBlog(
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const data = await this.blogService.createBlog(title, content);

    await this.emailService.sendBlogCreationEmail(title, content);
  }

  @Get()
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }
}
