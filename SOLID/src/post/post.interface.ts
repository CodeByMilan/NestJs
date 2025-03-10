

export interface IPostService {
    createPost(post: string): void;
    getPost(): string;
  }