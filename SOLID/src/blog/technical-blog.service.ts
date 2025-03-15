import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogCreator } from './blog-creator.abstract';
import { Blog } from './entities/blog.entity';

@Injectable()
export class TechnicalBlogService extends BlogCreator {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {
    super();
  }

  async createBlog(title: string, content: string): Promise<Blog> {
    const blog = this.blogRepository.create({
      title,
      content,
      category: 'Technical',
    });
    return await this.blogRepository.save(blog);
  }
}
