import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/Category';
import { City } from '../common/City';
import { Language } from './Language';

@Entity('tx_category_city_lang')
export class TxCategoryCityLang {
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
  description!: string;

  @Column('varchar', { nullable: true })
  meta_description!: string;

  @Column('varchar', { nullable: true })
  title!: string;

  constructor(
    category: Category,
    city: City,
    language: Language,
    name: string,
    description: string = '',
    meta_description: string = '',
    title: string = ''
  ) {
    this.category = category;
    this.city = city;
    this.language = language;
    this.name = name;
    this.description = description;
    this.meta_description = meta_description;
    this.title = title;
  }
}
