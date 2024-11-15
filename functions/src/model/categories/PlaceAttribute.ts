import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Place } from '../places/Place';
import { Attribute } from './Attribute';

@Entity('place_attributes')
export class PlaceAttributes {
  @PrimaryColumn()
  place_id!: number;

  @PrimaryColumn()
  attribute_id!: number;

  @Column('smallint', { nullable: false })
  value!: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Attribute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attribute_id' })
  attribute!: Attribute;

  constructor(place: Place, attribute: Attribute, value: number) {
    this.place = place;
    this.attribute = attribute;
    this.value = value;
  }
}
