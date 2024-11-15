import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Place } from '../places/Place';
import { Language } from './Language';

@Entity('tx_place')
export class TxPlace {
  @PrimaryColumn()
  place_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  meta_description!: string;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor(
    place: Place,
    language: Language,
    slug: string,
    name: string,
    title: string,
    description: string,
    meta_description: string
  ) {
    this.place = place;
    this.language = language;
    this.slug = slug;
    this.name = name;
    this.title = title;
    this.description = description;
    this.meta_description = meta_description;
  }
}
