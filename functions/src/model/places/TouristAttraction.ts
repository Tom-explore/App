import { Entity, Column, ChildEntity } from 'typeorm';
import { Place } from './Place';
import { PlaceType } from '../enums/PlaceType';
import { City } from '../common/City';
@ChildEntity(PlaceType.TOURIST_ATTRACTION)
export class TouristAttraction extends Place {
  @Column('varchar', { nullable: true })
  name_original!: string;

  @Column('varchar', { nullable: true })
  wiki_link!: string;

  @Column('smallint', { nullable: true })
  price_regular!: number;

  @Column('smallint', { nullable: true })
  price_children!: number;

  @Column('boolean', { default: false })
  tickets_gyg!: boolean;

  @Column('boolean', { default: false })
  tickets_civitatis!: boolean;

  @Column('varchar', { nullable: true })
  tickets_direct_site!: string;

  constructor(
    city: City,
    slug: string,
    name_original: string,
    wiki_link: string,
    price_regular: number,
    price_children: number,
    tickets_gyg: boolean,
    tickets_civitatis: boolean,
    tickets_direct_site: string,
    description_scrapio: string = ''
  ) {
    super(city, slug, PlaceType.TOURIST_ATTRACTION, description_scrapio);
    this.name_original = name_original;
    this.wiki_link = wiki_link;
    this.price_regular = price_regular;
    this.price_children = price_children;
    this.tickets_gyg = tickets_gyg;
    this.tickets_civitatis = tickets_civitatis;
    this.tickets_direct_site = tickets_direct_site;
  }
}
