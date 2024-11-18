import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('post_imgs')
export class PostImg extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('smallint', { nullable: true })
  position!: number;

  @Column('varchar', { nullable: true })
  author!: string;

  @Column('varchar', { nullable: true })
  license!: string;

  @Column('varchar', { nullable: true })
  directory!: string;

  @Column('varchar', { nullable: true })
  source!: string;

  constructor() {
    super();
  }

  static async createImage(data: Partial<PostImg>): Promise<PostImg> {
    const image = Object.assign(new PostImg(), data);
    return await image.save();
  }

  static async findById(id: number): Promise<PostImg | null> {
    return await PostImg.findOneBy({ id });
  }

  static async findAll(): Promise<PostImg[]> {
    return await PostImg.find();
  }

  static async updateImage(id: number, data: Partial<PostImg>): Promise<PostImg | null> {
    const image = await PostImg.findById(id);
    if (!image) return null;
    Object.assign(image, data);
    return await image.save();
  }

  static async deleteImage(id: number): Promise<boolean> {
    const image = await PostImg.findById(id);
    if (!image) return false;
    await image.remove();
    return true;
  }
}
