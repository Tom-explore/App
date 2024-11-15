import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from '../places/Place';
import { Category } from './Category';

@Entity('place_categories')
export class PlaceCategories extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column('boolean', { default: false })
  main!: boolean;

  constructor(place: Place, category: Category, main: boolean = false) {
    super();
    this.place = place;
    this.category = category;
    this.main = main;
  }
}
