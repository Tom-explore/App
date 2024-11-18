import { Entity, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Trip } from './Trip';
import { Attribute } from '../categories/Attribute';

@Entity('trip_attributes')
export class TripAttribute extends BaseEntity {
  @PrimaryColumn()
  trip_id!: number;

  @PrimaryColumn()
  attribute_id!: number;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ManyToOne(() => Attribute, { nullable: false })
  @JoinColumn({ name: 'attribute_id' })
  attribute!: Attribute;

  constructor() {
    super();
  }

  static async createAttribute(data: Partial<TripAttribute>): Promise<TripAttribute> {
    const tripAttribute = Object.assign(new TripAttribute(), data);
    return await tripAttribute.save();
  }

  static async findAttributeById(tripId: number, attributeId: number): Promise<TripAttribute | null> {
    return await TripAttribute.findOne({
      where: { trip_id: tripId, attribute_id: attributeId },
      relations: ['trip', 'attribute'],
    });
  }

  static async findAttributesByTrip(tripId: number): Promise<TripAttribute[]> {
    return await TripAttribute.find({
      where: { trip_id: tripId },
      relations: ['trip', 'attribute'],
    });
  }

  static async updateAttribute(
    tripId: number,
    attributeId: number,
    data: Partial<TripAttribute>
  ): Promise<TripAttribute | null> {
    const tripAttribute = await TripAttribute.findAttributeById(tripId, attributeId);
    if (!tripAttribute) return null;
    Object.assign(tripAttribute, data);
    return await tripAttribute.save();
  }

  static async deleteAttribute(tripId: number, attributeId: number): Promise<boolean> {
    const tripAttribute = await TripAttribute.findAttributeById(tripId, attributeId);
    if (!tripAttribute) return false;
    await tripAttribute.remove();
    return true;
  }
}
