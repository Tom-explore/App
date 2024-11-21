import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Category } from '../categories/Category';
import { Language } from '../translations/Language';

@Entity('tx_categories')
export class TxCategory extends BaseEntity {
  @PrimaryColumn()
  category_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('varchar', { nullable: true })
  description!: string;

  @Column('varchar', { nullable: true })
  meta_description!: string;

  @Column('varchar', { nullable: true })
  title!: string;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxCategory(data: Partial<TxCategory>): Promise<TxCategory> {
    const txCategory = Object.assign(new TxCategory(), data);
    return await txCategory.save();
  }

  static async findByCategoryAndLanguage(categoryId: number, languageId: number): Promise<TxCategory | null> {
    return await TxCategory.findOne({
      where: { category_id: categoryId, language_id: languageId },
      relations: ['category', 'language'],
    });
  }

  static async findByCategory(categoryId: number): Promise<TxCategory[]> {
    return await TxCategory.find({ where: { category_id: categoryId }, relations: ['category', 'language'] });
  }

  static async findByLanguage(languageId: number): Promise<TxCategory[]> {
    return await TxCategory.find({ where: { language_id: languageId }, relations: ['category', 'language'] });
  }

  static async updateTxCategory(categoryId: number, languageId: number, data: Partial<TxCategory>): Promise<TxCategory | null> {
    const txCategory = await TxCategory.findByCategoryAndLanguage(categoryId, languageId);
    if (!txCategory) return null;
    Object.assign(txCategory, data);
    return await txCategory.save();
  }

  static async deleteTxCategory(categoryId: number, languageId: number): Promise<boolean> {
    const txCategory = await TxCategory.findByCategoryAndLanguage(categoryId, languageId);
    if (!txCategory) return false;
    await txCategory.remove();
    return true;
  }
}
