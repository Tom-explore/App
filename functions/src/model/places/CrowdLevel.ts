import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Place } from './Place';
  import { CrowdStatus } from '../enums/CrowdStatus';
  
  @Entity('crowd_levels')
  export class CrowdLevels {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Place, { nullable: false })
    @JoinColumn({ name: 'place_id' })
    place!: Place;
  
    @Column('smallint', { nullable: false })
    day_of_week!: number;
  
    @Column('time', { nullable: false })
    hour!: string;
  
    @Column({
      type: 'enum',
      enum: CrowdStatus,
      nullable: false,
    })
    status!: CrowdStatus;
  
    constructor(place: Place, day_of_week: number, hour: string, status: CrowdStatus) {
      this.place = place;
      this.day_of_week = day_of_week;
      this.hour = hour;
      this.status = status;
    }
  }
  