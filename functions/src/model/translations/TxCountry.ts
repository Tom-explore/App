import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../common/Country';
import { Language } from './Language';

@Entity('tx_country')
export class TxCountry {
  @PrimaryColumn()
  country_id!: number;

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

  @Column('varchar')
  title!: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor(
    country: Country,
    language: Language,
    slug: string,
    name: string,
    description: string,
    meta_description: string,
    title: string
  ) {
    this.country = country;
    this.language = language;
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.meta_description = meta_description;
    this.title = title;
  }
}
