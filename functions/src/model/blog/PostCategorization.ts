import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  Column,
} from 'typeorm';
import { Post } from './Post';
import { Category } from '../categories/Category';

@Entity('post_categorizations')
export class PostCategorization extends BaseEntity {
  @PrimaryColumn({ name: 'post_id' })
  postId!: number;

  @PrimaryColumn({ name: 'category_id' })
  categoryId!: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne(() => Category, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column('boolean', { nullable: true })
  main!: boolean;

  constructor() {
    super();
  }

  static async createCategorization(data: Partial<PostCategorization>): Promise<PostCategorization> {
    const categorization = Object.assign(new PostCategorization(), data);
    return await categorization.save();
  }

  static async findByPostAndCategory(postId: number, categoryId: number): Promise<PostCategorization | null> {
    return await PostCategorization.findOne({ where: { postId, categoryId }, relations: ['post', 'category'] });
  }

  static async findByPost(postId: number): Promise<PostCategorization[]> {
    return await PostCategorization.find({ where: { postId }, relations: ['post', 'category'] });
  }

  static async updateCategorization(postId: number, categoryId: number, data: Partial<PostCategorization>): Promise<PostCategorization | null> {
    const categorization = await PostCategorization.findByPostAndCategory(postId, categoryId);
    if (!categorization) return null;
    Object.assign(categorization, data);
    return await categorization.save();
  }

  static async deleteCategorization(postId: number, categoryId: number): Promise<boolean> {
    const categorization = await PostCategorization.findByPostAndCategory(postId, categoryId);
    if (!categorization) return false;
    await categorization.remove();
    return true;
  }
}
