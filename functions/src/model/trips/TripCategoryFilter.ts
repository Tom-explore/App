import { Entity, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Trip } from './Trip';
import { Category } from '../categories/Category';

@Entity('trip_category_filter')
export class TripCategoryFilter extends BaseEntity {
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

  constructor() {
    super();
  }

  static async createTripCategoryFilter(data: Partial<TripCategoryFilter>): Promise<TripCategoryFilter> {
    const filter = Object.assign(new TripCategoryFilter(), data);
    return await filter.save();
  }

  static async findByTripAndCategory(tripId: number, categoryId: number): Promise<TripCategoryFilter | null> {
    return await TripCategoryFilter.findOne({
      where: { trip_id: tripId, category_id: categoryId },
      relations: ['trip', 'category'],
    });
  }

  static async findAll(): Promise<TripCategoryFilter[]> {
    return await TripCategoryFilter.find({ relations: ['trip', 'category'] });
  }

  static async deleteTripCategoryFilter(tripId: number, categoryId: number): Promise<boolean> {
    const filter = await TripCategoryFilter.findByTripAndCategory(tripId, categoryId);
    if (!filter) return false;
    await filter.remove();
    return true;
  }
}
