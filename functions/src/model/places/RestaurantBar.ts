import { Entity, Column, ChildEntity } from 'typeorm';
import { Place } from './Place';
import { PlaceType } from '../enums/PlaceType';
import { City } from '../common/City';
@ChildEntity(PlaceType.RESTAURANT_BAR)
export class RestaurantBar extends Place {
  @Column('varchar', { nullable: true })
  menu!: string;

  @Column('smallint', { nullable: true })
  price_min!: number;

  @Column('smallint', { nullable: true })
  price_max!: number;

  constructor(
    city: City,
    slug: string,
    menu: string,
    price_min: number,
    price_max: number,
    description_scrapio: string = ''
  ) {
    super(city, slug, PlaceType.RESTAURANT_BAR, description_scrapio);
    this.menu = menu;
    this.price_min = price_min;
    this.price_max = price_max;
  }
}
