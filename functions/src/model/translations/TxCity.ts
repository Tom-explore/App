import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { City } from '../common/City';
import { Language } from './Language';

@Entity('tx_city')
export class TxCity {
  @PrimaryColumn()
  city_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  meta_description!: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor(
    city: City,
    language: Language,
    slug: string,
    name: string,
    description: string,
    meta_description: string
  ) {
    this.city = city;
    this.language = language;
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.meta_description = meta_description;
  }
}
