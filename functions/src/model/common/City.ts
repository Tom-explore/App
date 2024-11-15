import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from './Country';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { nullable: true })
  country_id!: Country;

  @Column('int', { nullable: true })
  parent_city_id!: number;

  @Column('varchar')
  slug!: string;

  @Column('float', { nullable: true })
  lat!: number;

  @Column('float', { nullable: true })
  lng!: number;

  @Column('varchar', { nullable: true })
  video!: string;

  @Column('varchar', { nullable: true })
  main_img!: string;

  @Column('varchar', { nullable: true })
  img_marker!: string;

  @Column('int', { nullable: true })
  attraction_min_reviews!: number;

  @Column('boolean', { default: false })
  visible!: boolean;

  @Column('varchar', { nullable: true })
  scrapio!: string;

  @Column('varchar', { nullable: true })
  gyg!: string;

  @Column('varchar', { nullable: true })
  timezone!: string;

  @Column('smallint', { nullable: true })
  duration!: number;

  @Column('varchar', { nullable: true })
  link_city_card!: string;

  @Column('varchar', { nullable: true })
  link_taxi!: string;

  @Column('varchar', { nullable: true })
  link_car_rental!: string;

  @Column('varchar', { nullable: true })
  link_bike_rental!: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  constructor(
    slug: string,
    country: Country,
    parent_city_id: number = null,
    lat: number = 0,
    lng: number = 0,
    video: string = '',
    main_img: string = '',
    img_marker: string = '',
    attraction_min_reviews: number = 0,
    visible: boolean = false,
    scrapio: string = '',
    gyg: string = '',
    timezone: string = '',
    duration: number = 0,
    link_city_card: string = '',
    link_taxi: string = '',
    link_car_rental: string = '',
    link_bike_rental: string = ''
  ) {
    this.slug = slug;
    this.country_id = country;
    this.parent_city_id = parent_city_id;
    this.lat = lat;
    this.lng = lng;
    this.video = video;
    this.main_img = main_img;
    this.img_marker = img_marker;
    this.attraction_min_reviews = attraction_min_reviews;
    this.visible = visible;
    this.scrapio = scrapio;
    this.gyg = gyg;
    this.timezone = timezone;
    this.duration = duration;
    this.link_city_card = link_city_card;
    this.link_taxi = link_taxi;
    this.link_car_rental = link_car_rental;
    this.link_bike_rental = link_bike_rental;
  }
}
