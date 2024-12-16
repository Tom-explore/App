import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Post } from '../../model/blog/Post';
import { User } from '../../model/users/User';
import { Repository } from 'typeorm';

class PostController {
  private postRepository: Repository<Post>;
  private userRepository: Repository<User>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
    this.userRepository = AppDataSource.getRepository(User);
  }

  static async createPost(req: Request, res: Response): Promise<Response> {
    const controller = new PostController();

    try {
      const { userId, slug } = req.body;

      // Validation des données
      if (!userId || !slug) {
        return res.status(400).json({ message: 'userId and slug are required' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const post = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }

        const newPost = transactionalEntityManager.create(Post, { user, slug });
        return await transactionalEntityManager.save(newPost);
      });

      return res.status(201).json({ message: 'Post created successfully', post });
    } catch (error: any) {
      console.error('Error creating post:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  }

  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    const controller = new PostController();

    try {
      const posts = await controller.postRepository.find({
        relations: ['user'], // Charger les relations nécessaires
      });
      return res.status(200).json(posts);
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);
      return res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
  }

  static async getPostById(req: Request, res: Response): Promise<Response> {
    const controller = new PostController();

    try {
      const { id } = req.params;

      const post = await controller.postRepository.findOne({
        where: { id: Number(id) },
        relations: ['user'], // Charger les relations nécessaires
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      return res.status(200).json(post);
    } catch (error: any) {
      console.error('Error fetching post:', error.message);
      return res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
  }

  static async updatePost(req: Request, res: Response): Promise<Response> {
    const controller = new PostController();

    try {
      const { id } = req.params;
      const { slug } = req.body;

      // Validation des données
      if (!slug) {
        return res.status(400).json({ message: 'Slug is required to update the post' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const updatedPost = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const post = await transactionalEntityManager.findOne(Post, { where: { id: Number(id) } });
        if (!post) {
          throw new Error('Post not found');
        }

        transactionalEntityManager.merge(Post, post, { slug });
        return await transactionalEntityManager.save(post);
      });

      return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error: any) {
      console.error('Error updating post:', error.message);
      if (error.message === 'Post not found') {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(500).json({ message: 'Error updating post', error: error.message });
    }
  }

  static async deletePost(req: Request, res: Response): Promise<Response> {
    const controller = new PostController();

    try {
      const { id } = req.params;

      // Utilisation de la transaction pour garantir l'intégrité
      const isDeleted = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const post = await transactionalEntityManager.findOne(Post, { where: { id: Number(id) } });
        if (!post) {
          throw new Error('Post not found');
        }

        await transactionalEntityManager.remove(post);
        return true;
      });

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting post:', error.message);
      if (error.message === 'Post not found') {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
  }
}

export default PostController;
