import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  TableInheritance,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlaceType } from '../enums/PlaceType';
import { City } from '../common/City';

@Entity('places')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => City, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @Column('varchar', { nullable: true })
  description_scrapio!: string;

  @Column({
    type: 'enum',
    enum: PlaceType,
    nullable: false,
  })
  type!: PlaceType;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('varchar', { nullable: true })
  google_id!: string;

  @Column('varchar', { nullable: true })
  google_place_id!: string;

  @Column('varchar', { nullable: true })
  link_insta!: string;

  @Column('varchar', { nullable: true })
  link_fb!: string;

  @Column('varchar', { nullable: true })
  link_maps!: string;

  @Column('varchar', { nullable: true })
  link_website!: string;

  @Column('varchar', { nullable: true })
  link_linkedin!: string;

  @Column('varchar', { array: true, nullable: true })
  mails!: string[];

  @Column('varchar', { nullable: true })
  phone!: string;

  @Column('float', { nullable: true })
  lat!: number;

  @Column('float', { nullable: true })
  lng!: number;

  @Column('varchar', { nullable: true })
  address!: string;

  @Column('varchar', { nullable: true })
  zip_code!: string;

  @Column('timestamp', { default: null })
  scraped!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @CreateDateColumn()
  created!: Date;

  @Column('timestamp', { default: null })
  verified!: Date;

  @Column('timestamp', { nullable: false })
  last_api_scraped!: Date;

  @Column('boolean', { default: true })
  public!: boolean;

  @Column('smallint', { nullable: true })
  price_range!: number;

  @Column('smallint', { nullable: true })
  duration!: number;

  @Column('boolean', { default: false })
  is_closed!: boolean;

  @Column('boolean', { default: false })
  set_in_queue!: boolean;

  @Column('boolean', { default: false })
  imgs_scraped!: boolean;

  @Column('float', { nullable: true })
  reviews_google_rating!: number;

  @Column('int', { nullable: true })
  reviews_google_count!: number;

  @Column('float', { nullable: true })
  reviews_user_rating!: number;

  @Column('int', { nullable: true })
  reviews_user_count!: number;

  @Column('float', { nullable: true })
  reviews_average_rating!: number;

  @Column('int', { nullable: true })
  reviews_average_count!: number;

  constructor() {
    super();
  }

  static async createPlace(data: Partial<Place>): Promise<Place> {
    const place = Object.assign(new Place(), data);
    return await place.save();
  }

  static async findById(id: number): Promise<Place | null> {
    return await Place.findOne({ where: { id }, relations: ['city'] });
  }

  static async findAll(): Promise<Place[]> {
    return await Place.find({ relations: ['city'] });
  }

  static async updatePlace(id: number, data: Partial<Place>): Promise<Place | null> {
    const place = await Place.findById(id);
    if (!place) return null;
    Object.assign(place, data);
    return await place.save();
  }

  static async deletePlace(id: number): Promise<boolean> {
    const place = await Place.findById(id);
    if (!place) return false;
    await place.remove();
    return true;
  }
}
