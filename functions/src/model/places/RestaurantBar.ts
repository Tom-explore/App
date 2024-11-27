import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from './Place';

@Entity('restaurant_bars')
export class RestaurantBar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @Column('varchar', { nullable: true })
  menu!: string;

  @Column('smallint', { nullable: true })
  price_min!: number;

  @Column('smallint', { nullable: true })
  price_max!: number;

  constructor() {
    super();
  }



  static async createRestaurantBar(data: Partial<RestaurantBar>): Promise<RestaurantBar> {
    const restaurantBar = Object.assign(new RestaurantBar(), data);
    return await restaurantBar.save();
  }

  static async findById(id: number): Promise<RestaurantBar | null> {
    return await RestaurantBar.findOne({ where: { id }, relations: ['city'] });
  }

  static async findAll(): Promise<RestaurantBar[]> {
    return await RestaurantBar.find({ relations: ['city'] });
  }

  static async updateRestaurantBar(id: number, data: Partial<RestaurantBar>): Promise<RestaurantBar | null> {
    const restaurantBar = await RestaurantBar.findById(id);
    if (!restaurantBar) return null;
    Object.assign(restaurantBar, data);
    return await restaurantBar.save();
  }

  static async deleteRestaurantBar(id: number): Promise<boolean> {
    const restaurantBar = await RestaurantBar.findById(id);
    if (!restaurantBar) return false;
    await restaurantBar.remove();
    return true;
  }
}
