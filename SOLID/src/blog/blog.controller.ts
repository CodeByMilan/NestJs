import { Controller, Post, Get, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { EmailService } from 'src/email/email.service';
import { TechnicalBlogService } from './technical-blog.service';
import { TravelBlogService } from './travel-blog.service';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly emailService: EmailService,
    private readonly technicalBlogService: TechnicalBlogService,
    private readonly travelBlogService: TravelBlogService,
  ) {}

  @Post()
  async createGeneralBlog(@Body() body: { title: string; content: string }) { 
    const data = await this.blogService.createBlog(body.title, body.content);
    await this.emailService.sendBlogCreationEmail(body.title, body.content);
    return data;
  }
  @Post('technical')
  async createTechnicalBlog(@Body() body: { title: string; content: string }) {
    return await this.technicalBlogService.createBlog(body.title, body.content);
  }

  @Post('travel')
  async createTravelBlog(@Body() body: { title: string; content: string }) {
    return await this.travelBlogService.createBlog(body.title, body.content);
  }
  
  @Get()
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }
}
