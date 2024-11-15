import { Entity, Column, ChildEntity } from 'typeorm';
import { Place } from './Place';
import { PlaceType } from '../enums/PlaceType';
import { City } from '../common/City';
@ChildEntity(PlaceType.HOTEL)
export class Hotel extends Place {
  @Column('varchar', { nullable: true })
  booking_link!: string;

  @Column('smallint', { nullable: true })
  avg_price_per_night!: number;

  @Column('boolean', { default: false })
  pets_authorized!: boolean;

  constructor(
    city: City,
    slug: string,
    booking_link: string,
    avg_price_per_night: number,
    pets_authorized: boolean,
    description_scrapio: string = ''
  ) {
    super(city, slug, PlaceType.HOTEL, description_scrapio);
    this.booking_link = booking_link;
    this.avg_price_per_night = avg_price_per_night;
    this.pets_authorized = pets_authorized;
  }
}
