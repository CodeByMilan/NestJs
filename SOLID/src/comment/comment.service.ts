import { Injectable } from "@nestjs/common";
import { ICommentService } from "./comment.interface";


@Injectable()
export class CommentService implements ICommentService {
  addComment(comment: string) {
    console.log('Comment added:', comment);
  }

  getComments() {
    return  'Great post!' ;
  }
}