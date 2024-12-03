import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from '../places/Place';
import { Attribute } from './Attribute';

@Entity('place_attributes')
export class PlaceAttribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;



  @Column('smallint', { nullable: false })
  value!: number;
  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Attribute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attribute_id' })
  attribute!: Attribute;
  constructor() {
    super();
  }

  static async createPlaceAttribute(data: Partial<PlaceAttribute>): Promise<PlaceAttribute> {
    const placeAttribute = Object.assign(new PlaceAttribute(), data);
    return await placeAttribute.save();
  }

  static async findById(id: number): Promise<PlaceAttribute | null> {
    return await PlaceAttribute.findOne({ where: { id }, relations: ['place', 'attribute'] });
  }

  static async findByPlace(placeId: number): Promise<PlaceAttribute[]> {
    return await PlaceAttribute.find({ where: { place: { id: placeId } }, relations: ['place', 'attribute'] });
  }

  static async findByAttribute(attributeId: number): Promise<PlaceAttribute[]> {
    return await PlaceAttribute.find({ where: { attribute: { id: attributeId } }, relations: ['place', 'attribute'] });
  }

  static async updatePlaceAttribute(id: number, data: Partial<PlaceAttribute>): Promise<PlaceAttribute | null> {
    const placeAttribute = await PlaceAttribute.findById(id);
    if (!placeAttribute) return null;
    Object.assign(placeAttribute, data);
    return await placeAttribute.save();
  }

  static async deletePlaceAttribute(id: number): Promise<boolean> {
    const placeAttribute = await PlaceAttribute.findById(id);
    if (!placeAttribute) return false;
    await placeAttribute.remove();
    return true;
  }

}
