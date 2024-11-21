import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('boolean', { default: false })
  main!: boolean;

  @Column('boolean', { default: false })
  for_trip_form!: boolean;

  @Column('boolean', { default: false })
  for_posts!: boolean;

  @Column('varchar', { nullable: true })
  scrapio_name!: string;

  constructor() {
    super();
  }

  static async createCategory(data: Partial<Category>): Promise<Category> {
    const category = Object.assign(new Category(), data);
    return await category.save();
  }

  static async findById(id: number): Promise<Category | null> {
    return await Category.findOneBy({ id });
  }

  static async findAll(): Promise<Category[]> {
    return await Category.find();
  }

  static async updateCategory(id: number, data: Partial<Category>): Promise<Category | null> {
    const category = await Category.findById(id);
    if (!category) return null;
    Object.assign(category, data);
    return await category.save();
  }

  static async deleteCategory(id: number): Promise<boolean> {
    const category = await Category.findById(id);
    if (!category) return false;
    await category.remove();
    return true;
  }
}
