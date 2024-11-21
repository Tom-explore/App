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

  constructor() {
    super();
  }

  static async createTouristAttraction(data: Partial<TouristAttraction>): Promise<TouristAttraction> {
    const attraction = Object.assign(new TouristAttraction(), data);
    return await attraction.save();
  }

  static async findById(id: number): Promise<TouristAttraction | null> {
    return await TouristAttraction.findOne({ where: { id }, relations: ['city'] });
  }

  static async findAll(): Promise<TouristAttraction[]> {
    return await TouristAttraction.find({ relations: ['city'] });
  }

  static async updateTouristAttraction(id: number, data: Partial<TouristAttraction>): Promise<TouristAttraction | null> {
    const attraction = await TouristAttraction.findById(id);
    if (!attraction) return null;
    Object.assign(attraction, data);
    return await attraction.save();
  }

  static async deleteTouristAttraction(id: number): Promise<boolean> {
    const attraction = await TouristAttraction.findById(id);
    if (!attraction) return false;
    await attraction.remove();
    return true;
  }
}
