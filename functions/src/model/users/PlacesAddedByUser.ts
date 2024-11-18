import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Place } from '../places/Place';

@Entity('places_added_by_user')
export class PlacesAddedByUser extends BaseEntity {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  place_id!: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  added_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  constructor() {
    super();
  }

  static async createPlaceAdded(data: Partial<PlacesAddedByUser>): Promise<PlacesAddedByUser> {
    const placeAdded = Object.assign(new PlacesAddedByUser(), data);
    return await placeAdded.save();
  }

  static async findPlaceAddedById(userId: number, placeId: number): Promise<PlacesAddedByUser | null> {
    return await PlacesAddedByUser.findOne({
      where: { user_id: userId, place_id: placeId },
      relations: ['user', 'place'],
    });
  }

  static async findPlacesAddedByUser(userId: number): Promise<PlacesAddedByUser[]> {
    return await PlacesAddedByUser.find({
      where: { user_id: userId },
      relations: ['user', 'place'],
    });
  }

  static async updatePlaceAdded(
    userId: number,
    placeId: number,
    data: Partial<PlacesAddedByUser>
  ): Promise<PlacesAddedByUser | null> {
    const placeAdded = await PlacesAddedByUser.findPlaceAddedById(userId, placeId);
    if (!placeAdded) return null;
    Object.assign(placeAdded, data);
    return await placeAdded.save();
  }

  static async deletePlaceAdded(userId: number, placeId: number): Promise<boolean> {
    const placeAdded = await PlacesAddedByUser.findPlaceAddedById(userId, placeId);
    if (!placeAdded) return false;
    await placeAdded.remove();
    return true;
  }
}
