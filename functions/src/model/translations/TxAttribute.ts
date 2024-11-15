import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Attribute } from '../categories/Attribute';
import { Language } from './Language';

@Entity('tx_attribute')
export class TxAttribute {
  @PrimaryColumn()
  attribute_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  meta_description!: string;

  @Column('varchar')
  title!: string;

  @ManyToOne(() => Attribute)
  @JoinColumn({ name: 'attribute_id' })
  attribute!: Attribute;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor(
    attribute: Attribute,
    language: Language,
    name: string,
    slug: string,
    description: string,
    meta_description: string,
    title: string
  ) {
    this.attribute = attribute;
    this.language = language;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.meta_description = meta_description;
    this.title = title;
  }
}
