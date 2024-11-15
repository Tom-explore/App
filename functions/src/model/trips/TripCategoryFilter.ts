import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Trip } from './Trip';
  import { Category } from '../categories/Category';
  
  @Entity('trip_category_filter')
  export class TripCategoryFilter {
    @PrimaryColumn()
    trip_id!: number;
  
    @PrimaryColumn()
    category_id!: number;
  
    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'trip_id' })
    trip!: Trip;
  
    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category!: Category;
  
    constructor(trip: Trip, category: Category) {
      this.trip = trip;
      this.category = category;
    }
  }
  