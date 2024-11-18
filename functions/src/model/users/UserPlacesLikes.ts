import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Place } from '../places/Place';

@Entity('user_places_likes')
export class UserPlacesLike extends BaseEntity {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  place_id!: number;

  @Column('boolean')
  liked!: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  changed_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  constructor() {
    super();
  }

  static async createLike(data: Partial<UserPlacesLike>): Promise<UserPlacesLike> {
    const like = Object.assign(new UserPlacesLike(), data);
    return await like.save();
  }

  static async findLikeById(userId: number, placeId: number): Promise<UserPlacesLike | null> {
    return await UserPlacesLike.findOne({
      where: { user_id: userId, place_id: placeId },
      relations: ['user', 'place'],
    });
  }

  static async findLikesByUser(userId: number): Promise<UserPlacesLike[]> {
    return await UserPlacesLike.find({
      where: { user_id: userId },
      relations: ['user', 'place'],
    });
  }

  static async updateLike(
    userId: number,
    placeId: number,
    data: Partial<UserPlacesLike>
  ): Promise<UserPlacesLike | null> {
    const like = await UserPlacesLike.findLikeById(userId, placeId);
    if (!like) return null;
    Object.assign(like, data);
    return await like.save();
  }

  static async deleteLike(userId: number, placeId: number): Promise<boolean> {
    const like = await UserPlacesLike.findLikeById(userId, placeId);
    if (!like) return false;
    await like.remove();
    return true;
  }
}
