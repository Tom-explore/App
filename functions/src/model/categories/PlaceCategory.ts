import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from '../places/Place';
import { Category } from './Category';

@Entity('place_categories')
export class PlaceCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column('boolean', { default: false })
  best_for!: boolean;

  constructor() {
    super();
  }

  static async createPlaceCategory(data: Partial<PlaceCategory>): Promise<PlaceCategory> {
    const placeCategory1 = Object.assign(new PlaceCategory(), data);
    return await placeCategory1.save();
  }

  static async findById(id: number): Promise<PlaceCategory | null> {
    return await PlaceCategory.findOne({ where: { id }, relations: ['place', 'category'] });
  }

  static async findByPlace(placeId: number): Promise<PlaceCategory[]> {
    return await PlaceCategory.find({ where: { place: { id: placeId } }, relations: ['place', 'category'] });
  }

  static async findByCategory(categoryId: number): Promise<PlaceCategory[]> {
    return await PlaceCategory.find({ where: { category: { id: categoryId } }, relations: ['place', 'category'] });
  }

  static async updatePlaceCategory(id: number, data: Partial<PlaceCategory>): Promise<PlaceCategory | null> {
    const placeCategory = await PlaceCategory.findById(id);
    if (!placeCategory) return null;
    Object.assign(placeCategory, data);
    return await placeCategory.save();
  }

  static async deletePlaceCategory(id: number): Promise<boolean> {
    const placeCategory = await PlaceCategory.findById(id);
    if (!placeCategory) return false;
    await placeCategory.remove();
    return true;
  }
}
