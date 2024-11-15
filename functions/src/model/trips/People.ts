import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Trip } from './Trip';

@Entity('people')
export class People {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Trip, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @Column('smallint', { nullable: true })
  age!: number;

  constructor(trip: Trip, age: number = null) {
    this.trip = trip;
    this.age = age;
  }
}
