import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async createBlog(title: string, content: string): Promise<Blog> {
    const blog = this.blogRepository.create({ title, content });
    return await this.blogRepository.save(blog);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogRepository.find();
  }
}
