

export abstract class BlogCreator {
  abstract createBlog(title: string, content: string): Promise<any>;
}
