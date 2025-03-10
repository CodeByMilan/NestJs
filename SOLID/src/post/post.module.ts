import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import {PostService} from './post.service';
import { PostController } from './post.controller';


@Module({
  imports: [NotificationModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
