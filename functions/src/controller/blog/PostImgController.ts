import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { PostImg } from '../../model/blog/PostImg';
import { Repository } from 'typeorm';

class PostImgController {
  private postImgRepository: Repository<PostImg>;

  constructor() {
    this.postImgRepository = AppDataSource.getRepository(PostImg);
  }

  static async createPostImg(req: Request, res: Response): Promise<Response> {
    const controller = new PostImgController();

    try {
      const { slug, position, author, license, directory, source } = req.body;

      // Validation des données
      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const postImg = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const newPostImg = transactionalEntityManager.create(PostImg, {
          slug,
          position,
          author,
          license,
          directory,
          source,
        });

        return await transactionalEntityManager.save(newPostImg);
      });

      return res.status(201).json({ message: 'Post image created successfully', postImg });
    } catch (error: any) {
      console.error('Error creating post image:', error.message);
      return res.status(500).json({ message: 'Error creating post image', error: error.message });
    }
  }

  static async getPostImgById(req: Request, res: Response): Promise<Response> {
    const controller = new PostImgController();

    try {
      const { id } = req.params;

      const postImg = await controller.postImgRepository.findOne({
        where: { id: Number(id) },
      });

      if (!postImg) {
        return res.status(404).json({ message: 'Post image not found' });
      }

      return res.status(200).json(postImg);
    } catch (error: any) {
      console.error('Error fetching post image:', error.message);
      return res.status(500).json({ message: 'Error fetching post image', error: error.message });
    }
  }

  static async getAllPostImgs(req: Request, res: Response): Promise<Response> {
    const controller = new PostImgController();

    try {
      const postImgs = await controller.postImgRepository.find();
      return res.status(200).json(postImgs);
    } catch (error: any) {
      console.error('Error fetching post images:', error.message);
      return res.status(500).json({ message: 'Error fetching post images', error: error.message });
    }
  }

  static async updatePostImg(req: Request, res: Response): Promise<Response> {
    const controller = new PostImgController();

    try {
      const { id } = req.params;
      const { slug, position, author, license, directory, source } = req.body;

      // Validation des données
      if (!slug && position === undefined && !author && !license && !directory && !source) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const updatedPostImg = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const postImg = await transactionalEntityManager.findOne(PostImg, { where: { id: Number(id) } });
        if (!postImg) {
          throw new Error('Post image not found');
        }

        transactionalEntityManager.merge(PostImg, postImg, {
          slug,
          position,
          author,
          license,
          directory,
          source,
        });

        return await transactionalEntityManager.save(postImg);
      });

      return res.status(200).json({ message: 'Post image updated successfully', postImg: updatedPostImg });
    } catch (error: any) {
      console.error('Error updating post image:', error.message);
      if (error.message === 'Post image not found') {
        return res.status(404).json({ message: 'Post image not found' });
      }
      return res.status(500).json({ message: 'Error updating post image', error: error.message });
    }
  }

  static async deletePostImg(req: Request, res: Response): Promise<Response> {
    const controller = new PostImgController();

    try {
      const { id } = req.params;

      // Utilisation de la transaction pour garantir l'intégrité
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const postImg = await transactionalEntityManager.findOne(PostImg, { where: { id: Number(id) } });
        if (!postImg) {
          throw new Error('Post image not found');
        }

        await transactionalEntityManager.remove(postImg);
        return true;
      });

      return res.status(200).json({ message: 'Post image deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting post image:', error.message);
      if (error.message === 'Post image not found') {
        return res.status(404).json({ message: 'Post image not found' });
      }
      return res.status(500).json({ message: 'Error deleting post image', error: error.message });
    }
  }
}

export default PostImgController;
