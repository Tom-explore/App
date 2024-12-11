import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { PostBloc } from '../../model/blog/PostBloc';
import { Post } from '../../model/blog/Post';
import { Repository } from 'typeorm';

class PostBlocController {
  private postBlocRepository: Repository<PostBloc>;
  private postRepository: Repository<Post>;

  constructor() {
    this.postBlocRepository = AppDataSource.getRepository(PostBloc);
    this.postRepository = AppDataSource.getRepository(Post);
  }

  static async createPostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new PostBlocController();

    try {
      const { post_id, position, titleType, template, visible } = req.body;

      // Validation des données
      if (!post_id || position === undefined || !titleType || !template || visible === undefined) {
        return res.status(400).json({ message: 'All fields are required: post_id, position, titleType, template, visible' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const postBloc = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const post = await transactionalEntityManager.findOne(Post, { where: { id: post_id } });
        if (!post) {
          throw new Error(`Post with ID ${post_id} not found`);
        }

        const newPostBloc = transactionalEntityManager.create(PostBloc, {
          post,
          position,
          titleType,
          template,
          visible,
        });

        return await transactionalEntityManager.save(newPostBloc);
      });

      return res.status(201).json({ message: 'PostBloc created successfully', postBloc });
    } catch (error: any) {
      console.error('Error creating PostBloc:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating PostBloc', error: error.message });
    }
  }

  static async getPostBlocById(req: Request, res: Response): Promise<Response> {
    const controller = new PostBlocController();

    try {
      const { id } = req.params;
      const postBloc = await controller.postBlocRepository.findOne({
        where: { id: Number(id) },
        relations: ['post'],
      });

      if (!postBloc) {
        return res.status(404).json({ message: 'PostBloc not found' });
      }

      return res.status(200).json(postBloc);
    } catch (error: any) {
      console.error('Error fetching PostBloc:', error.message);
      return res.status(500).json({ message: 'Error fetching PostBloc', error: error.message });
    }
  }

  static async getAllPostBlocs(req: Request, res: Response): Promise<Response> {
    const controller = new PostBlocController();

    try {
      const postBlocs = await controller.postBlocRepository.find({
        relations: ['post'],
      });

      return res.status(200).json(postBlocs);
    } catch (error: any) {
      console.error('Error fetching PostBlocs:', error.message);
      return res.status(500).json({ message: 'Error fetching PostBlocs', error: error.message });
    }
  }

  static async updatePostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new PostBlocController();

    try {
      const { id } = req.params;
      const data = req.body;

      // Validation des données
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const updatedPostBloc = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const postBloc = await transactionalEntityManager.findOne(PostBloc, { where: { id: Number(id) } });
        if (!postBloc) {
          throw new Error('PostBloc not found');
        }

        transactionalEntityManager.merge(PostBloc, postBloc, data);
        return await transactionalEntityManager.save(postBloc);
      });

      return res.status(200).json({ message: 'PostBloc updated successfully', postBloc: updatedPostBloc });
    } catch (error: any) {
      console.error('Error updating PostBloc:', error.message);
      if (error.message === 'PostBloc not found') {
        return res.status(404).json({ message: 'PostBloc not found' });
      }
      return res.status(500).json({ message: 'Error updating PostBloc', error: error.message });
    }
  }

  static async deletePostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new PostBlocController();

    try {
      const { id } = req.params;

      // Utilisation de la transaction pour garantir l'intégrité
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const postBloc = await transactionalEntityManager.findOne(PostBloc, { where: { id: Number(id) } });
        if (!postBloc) {
          throw new Error('PostBloc not found');
        }

        await transactionalEntityManager.remove(postBloc);
        return true;
      });

      return res.status(200).json({ message: 'PostBloc deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting PostBloc:', error.message);
      if (error.message === 'PostBloc not found') {
        return res.status(404).json({ message: 'PostBloc not found' });
      }
      return res.status(500).json({ message: 'Error deleting PostBloc', error: error.message });
    }
  }
}

export default PostBlocController;
