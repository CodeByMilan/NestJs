export interface ICommentService {
  addComment(comment: string): void;
  getComments(): string;
}
