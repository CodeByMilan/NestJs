import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { NotificationService } from '../notification/notification.service';
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('create')
  public async postBlog(@Body('post') post: string) {
    await this.postService.createPost(post);
    await this.notificationService.sendNotification('hello');
    return 'Post created successfully';
  }
}
