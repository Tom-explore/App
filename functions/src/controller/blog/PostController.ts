import { Request, Response } from 'express';
import { Post } from '../../model/blog/Post';
import { User } from '../../model/users/User';

class PostController {
  static async createPost(req: Request, res: Response): Promise<Response> {
    const { userId, slug } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const post = await Post.createPost({ user, slug });
    return res.status(201).json({ message: 'Post created successfully', post });
  }

  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    const posts = await Post.findAll();
    return res.status(200).json(posts);
  }

  static async getPostById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const post = await Post.findById(parseInt(id, 10));
    if (!post) return res.status(404).json({ message: 'Post not found' });

    return res.status(200).json(post);
  }

  static async updatePost(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { slug } = req.body;

    const updatedPost = await Post.updatePost(parseInt(id, 10), { slug });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  }

  static async deletePost(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const isDeleted = await Post.deletePost(parseInt(id, 10));
    if (!isDeleted) return res.status(404).json({ message: 'Post not found' });

    return res.status(200).json({ message: 'Post deleted successfully' });
  }
}

export default PostController;
