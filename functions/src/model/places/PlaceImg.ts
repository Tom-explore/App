import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from './Place';

@Entity('place_imgs')
export class PlaceImg extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('varchar', { nullable: true })
  author!: string;

  @Column('varchar', { nullable: true })
  license!: string;

  @Column('smallint', { nullable: true })
  top!: number;

  @Column('varchar', { nullable: true })
  source!: string;

  constructor(
    place: Place,
    slug: string,
    author: string = '',
    license: string = '',
    top: number | null = null,
    source: string = ''
  ) {
    super();
    this.place = place;
    this.slug = slug;
    this.author = author;
    this.license = license;
    this.top = top;
    this.source = source;
  }
}
