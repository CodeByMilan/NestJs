import { Injectable } from "@nestjs/common";
import { IPostService } from "./post.interface";

@Injectable()
export class PostService implements IPostService {
  createPost(post: string) {
    console.log('Post created:', post);
  }

  getPost() {
    return  'This is a sample post.' ;
  }
}