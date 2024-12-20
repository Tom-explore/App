import { Request, Response } from 'express';
import { PostBloc } from '../../model/blog/PostBloc';
import { Post } from '../../model/blog/Post';

export default class PostBlocController {
  static async createPostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { post_id, position, titleType, template, visible } = req.body;
  
      const post = await Post.findOneBy({ id: post_id });
      if (!post) {
        return res.status(404).json({ message: `Post with ID ${post_id} not found` });
      }
  
      const postBloc = await PostBloc.createBloc({
        post,
        position,
        titleType,
        template,
        visible,
      });
  
      return res.status(201).json({ message: 'PostBloc created successfully', postBloc });
    } catch (error) {
      console.error('Error creating PostBloc:', error.message);
      return res.status(400).json({ message: 'Error creating PostBloc', error: error.message });
    }
  }
  
  static async getPostBlocById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const postBloc = await PostBloc.findById(Number(id));
      if (!postBloc) {
        return res.status(404).json({ message: 'PostBloc not found' });
      }
      return res.status(200).json(postBloc);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching PostBloc', error: error.message });
    }
  }

  static async getAllPostBlocs(req: Request, res: Response): Promise<Response> {
    try {
      const postBlocs = await PostBloc.findAll();
      return res.status(200).json(postBlocs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching PostBlocs', error: error.message });
    }
  }

  static async updatePostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const postBloc = await PostBloc.updateBloc(Number(id), data);
      if (!postBloc) {
        return res.status(404).json({ message: 'PostBloc not found' });
      }
      return res.status(200).json({ message: 'PostBloc updated successfully', postBloc });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating PostBloc', error: error.message });
    }
  }

  static async deletePostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await PostBloc.deleteBloc(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'PostBloc not found' });
      }
      return res.status(200).json({ message: 'PostBloc deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting PostBloc', error: error.message });
    }
  }
}

