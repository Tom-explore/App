import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../users/User';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('varchar', { nullable: false })
  slug!: string;

  constructor() {
    super();
  }

  static async createPost(data: Partial<Post>): Promise<Post> {
    const post = Object.assign(new Post(), data);
    return await post.save();
  }

  static async findById(id: number): Promise<Post | null> {
    return await Post.findOne({ where: { id }, relations: ['user'] });
  }

  static async findAll(): Promise<Post[]> {
    return await Post.find({ relations: ['user'] });
  }

  static async updatePost(id: number, data: Partial<Post>): Promise<Post | null> {
    const post = await Post.findOneBy({ id });
    if (!post) return null;
    Object.assign(post, data);
    return await post.save();
  }

  static async deletePost(id: number): Promise<boolean> {
    const post = await Post.findOneBy({ id });
    if (!post) return false;
    await post.remove();
    return true;
  }
}
