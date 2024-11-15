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

  constructor(
    city: City,
    slug: string,
    type: PlaceType,
    description_scrapio: string = '',
    google_id: string = '',
    google_place_id: string = '',
    link_insta: string = '',
    link_fb: string = '',
    link_maps: string = '',
    link_website: string = '',
    link_linkedin: string = '',
    mails: string[] = [],
    phone: string = '',
    lat: number = 0,
    lng: number = 0,
    address: string = '',
    zip_code: string = '',
    scraped: Date | null = null,
    last_api_scraped: Date = new Date(),
    public_flag: boolean = true,
    price_range: number | null = null,
    duration: number | null = null,
    is_closed: boolean = false,
    set_in_queue: boolean = false,
    imgs_scraped: boolean = false,
    reviews_google_rating: number | null = null,
    reviews_google_count: number | null = null,
    reviews_user_rating: number | null = null,
    reviews_user_count: number | null = null,
    reviews_average_rating: number | null = null,
    reviews_average_count: number | null = null
  ) {
    super();
    this.city = city;
    this.slug = slug;
    this.type = type;
    this.description_scrapio = description_scrapio;
    this.google_id = google_id;
    this.google_place_id = google_place_id;
    this.link_insta = link_insta;
    this.link_fb = link_fb;
    this.link_maps = link_maps;
    this.link_website = link_website;
    this.link_linkedin = link_linkedin;
    this.mails = mails;
    this.phone = phone;
    this.lat = lat;
    this.lng = lng;
    this.address = address;
    this.zip_code = zip_code;
    this.scraped = scraped;
    this.last_api_scraped = last_api_scraped;
    this.public = public_flag;
    this.price_range = price_range;
    this.duration = duration;
    this.is_closed = is_closed;
    this.set_in_queue = set_in_queue;
    this.imgs_scraped = imgs_scraped;
    this.reviews_google_rating = reviews_google_rating;
    this.reviews_google_count = reviews_google_count;
    this.reviews_user_rating = reviews_user_rating;
    this.reviews_user_count = reviews_user_count;
    this.reviews_average_rating = reviews_average_rating;
    this.reviews_average_count = reviews_average_count;
  }
}
