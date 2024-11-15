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

  constructor(
    category: Category,
    language: Language,
    name: string,
    slug: string,
    description: string = '',
    meta_description: string = '',
    title: string = ''
  ) {
    super();
    this.category = category;
    this.language = language;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.meta_description = meta_description;
    this.title = title;
  }
}
