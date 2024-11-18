import { Request, Response } from 'express';
import { PostImg } from '../../model/blog/PostImg';

class PostImgController {
  static async createPostImg(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const postImg = await PostImg.createImage(data);
      return res.status(201).json({ message: 'Post image created successfully', postImg });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating post image', error: error.message });
    }
  }

  static async getPostImgById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const postImg = await PostImg.findById(Number(id));
      if (!postImg) {
        return res.status(404).json({ message: 'Post image not found' });
      }
      return res.status(200).json(postImg);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching post image', error: error.message });
    }
  }

  static async getAllPostImgs(req: Request, res: Response): Promise<Response> {
    try {
      const postImgs = await PostImg.findAll();
      return res.status(200).json(postImgs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching post images', error: error.message });
    }
  }

  static async updatePostImg(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const postImg = await PostImg.updateImage(Number(id), data);
      if (!postImg) {
        return res.status(404).json({ message: 'Post image not found' });
      }
      return res.status(200).json({ message: 'Post image updated successfully', postImg });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating post image', error: error.message });
    }
  }

  static async deletePostImg(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await PostImg.deleteImage(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Post image not found' });
      }
      return res.status(200).json({ message: 'Post image deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting post image', error: error.message });
    }
  }
}

export default PostImgController;
