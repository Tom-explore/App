import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Category } from '../categories/Category';
import { City } from '../common/City';
import { Language } from './Language';

@Entity('tx_category_city_lang')
export class TxCategoryCityLang extends BaseEntity {
  @PrimaryColumn({ name: 'category_id' })
  category_id!: number;

  @PrimaryColumn({ name: 'city_id' })
  city_id!: number;

  @PrimaryColumn({ name: 'language_id' })
  language_id!: number;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToOne(() => City, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @ManyToOne(() => Language, { nullable: false })
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('varchar', { nullable: true })
  title!: string;

  @Column('varchar', { nullable: true })
  description!: string;

  @Column('varchar', { nullable: true })
  meta_description!: string;

  constructor() {
    super();
  }

  static async createTxCategoryCityLang(data: Partial<TxCategoryCityLang>): Promise<TxCategoryCityLang> {
    const txCategoryCityLang = Object.assign(new TxCategoryCityLang(), data);
    return await txCategoryCityLang.save();
  }

  static async findByCategoryCityLanguage(categoryId: number, cityId: number, languageId: number): Promise<TxCategoryCityLang | null> {
    return await TxCategoryCityLang.findOne({
      where: { category_id: categoryId, city_id: cityId, language_id: languageId },
      relations: ['category', 'city', 'language'],
    });
  }

  static async findByCategory(categoryId: number): Promise<TxCategoryCityLang[]> {
    return await TxCategoryCityLang.find({
      where: { category_id: categoryId },
      relations: ['category', 'city', 'language'],
    });
  }

  static async findByCity(cityId: number): Promise<TxCategoryCityLang[]> {
    return await TxCategoryCityLang.find({
      where: { city_id: cityId },
      relations: ['category', 'city', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxCategoryCityLang[]> {
    return await TxCategoryCityLang.find({
      where: { language_id: languageId },
      relations: ['category', 'city', 'language'],
    });
  }

  static async updateTxCategoryCityLang(categoryId: number, cityId: number, languageId: number, data: Partial<TxCategoryCityLang>): Promise<TxCategoryCityLang | null> {
    const txCategoryCityLang = await TxCategoryCityLang.findByCategoryCityLanguage(categoryId, cityId, languageId);
    if (!txCategoryCityLang) return null;
    Object.assign(txCategoryCityLang, data);
    return await txCategoryCityLang.save();
  }

  static async deleteTxCategoryCityLang(categoryId: number, cityId: number, languageId: number): Promise<boolean> {
    const txCategoryCityLang = await TxCategoryCityLang.findByCategoryCityLanguage(categoryId, cityId, languageId);
    if (!txCategoryCityLang) return false;
    await txCategoryCityLang.remove();
    return true;
  }
}
