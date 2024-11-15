import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Trip } from './Trip';
import { Attribute } from '../categories/Attribute';  
  @Entity('trip_attributes')
  export class TripAttributes {
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
  
    constructor(trip: Trip, attribute: Attribute) {
      this.trip = trip;
      this.attribute = attribute;
    }
  }
  