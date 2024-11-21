import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../blog/Post';
import { Language } from '../translations/Language';

@Entity('tx_posts')
export class TxPost extends BaseEntity {
  @PrimaryColumn({ name: 'post_id' })
  postId!: number;

  @PrimaryColumn({ name: 'language_id' })
  languageId!: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('varchar', { nullable: true })
  description!: string;

  @Column('varchar', { nullable: true })
  metaDescription!: string;

  @Column('varchar', { nullable: true })
  title!: string;

  @Column('boolean', { default: false })
  visible!: boolean;

  @Column('varchar', { nullable: false })
  slug!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column('timestamp', { nullable: true })
  planned!: Date;

  constructor() {
    super();
  }

  static async createTxPost(data: Partial<TxPost>): Promise<TxPost> {
    const txPost = Object.assign(new TxPost(), data);
    return await txPost.save();
  }

  static async findByPostAndLanguage(postId: number, languageId: number): Promise<TxPost | null> {
    return await TxPost.findOne({
      where: { postId, languageId },
      relations: ['post', 'language'],
    });
  }

  static async findByPost(postId: number): Promise<TxPost[]> {
    return await TxPost.find({
      where: { postId },
      relations: ['post', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxPost[]> {
    return await TxPost.find({
      where: { languageId },
      relations: ['post', 'language'],
    });
  }

  static async updateTxPost(postId: number, languageId: number, data: Partial<TxPost>): Promise<TxPost | null> {
    const txPost = await TxPost.findByPostAndLanguage(postId, languageId);
    if (!txPost) return null;
    Object.assign(txPost, data);
    return await txPost.save();
  }

  static async deleteTxPost(postId: number, languageId: number): Promise<boolean> {
    const txPost = await TxPost.findByPostAndLanguage(postId, languageId);
    if (!txPost) return false;
    await txPost.remove();
    return true;
  }
}
