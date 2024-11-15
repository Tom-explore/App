import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Place } from './Place';
  
  @Entity('opening_hours')
  export class OpeningHours {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Place, { nullable: false })
    @JoinColumn({ name: 'place_id' })
    place!: Place;
  
    @Column('smallint', { nullable: false })
    day_of_week!: number;
  
    @Column('time', { nullable: true })
    start_time_1!: string;
  
    @Column('time', { nullable: true })
    stop_time_1!: string;
  
    @Column('time', { nullable: true })
    start_time_2!: string;
  
    @Column('time', { nullable: true })
    stop_time_2!: string;
  
    constructor(
      place: Place,
      day_of_week: number,
      start_time_1: string = '',
      stop_time_1: string = '',
      start_time_2: string = '',
      stop_time_2: string = ''
    ) {
      this.place = place;
      this.day_of_week = day_of_week;
      this.start_time_1 = start_time_1;
      this.stop_time_1 = stop_time_1;
      this.start_time_2 = start_time_2;
      this.stop_time_2 = stop_time_2;
    }
  }
  