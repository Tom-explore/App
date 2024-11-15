import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Trip } from './Trip';
  import { Place } from '../places/Place';
  
  @Entity('trip_composition')
  export class TripComposition {
    @PrimaryColumn()
    trip_id!: number;
  
    @PrimaryColumn()
    day!: number;
  
    @PrimaryColumn()
    position!: number;
  
    @PrimaryColumn()
    place_id!: number;
  
    @Column('timestamp', { nullable: true })
    datetime!: Date;
  
    @Column('boolean', { nullable: true })
    deleted!: boolean;
  
    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'trip_id' })
    trip!: Trip;
  
    @ManyToOne(() => Place, { nullable: false })
    @JoinColumn({ name: 'place_id' })
    place!: Place;
  
    constructor(
      trip: Trip,
      day: number,
      position: number,
      place: Place,
      datetime: Date = null,
      deleted: boolean = null
    ) {
      this.trip = trip;
      this.day = day;
      this.position = position;
      this.place = place;
      this.datetime = datetime;
      this.deleted = deleted;
    }
  }
  