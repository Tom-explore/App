import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Place } from '../places/Place';

@Entity('user_places_preferences')
export class UserPlacesPreference extends BaseEntity {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  place_id!: number;

  @Column('boolean', { default: false })
  wants_to_visit!: boolean;

  @Column('boolean', { default: false })
  visited!: boolean;

  @Column('boolean', { default: false })
  not_interested!: boolean;

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

  static async createPreference(data: Partial<UserPlacesPreference>): Promise<UserPlacesPreference> {
    const preference = Object.assign(new UserPlacesPreference(), data);
    return await preference.save();
  }

  static async findPreferenceById(userId: number, placeId: number): Promise<UserPlacesPreference | null> {
    return await UserPlacesPreference.findOne({
      where: { user_id: userId, place_id: placeId },
      relations: ['user', 'place'],
    });
  }

  static async findPreferencesByUser(userId: number): Promise<UserPlacesPreference[]> {
    return await UserPlacesPreference.find({
      where: { user_id: userId },
      relations: ['user', 'place'],
    });
  }

  static async updatePreference(
    userId: number,
    placeId: number,
    data: Partial<UserPlacesPreference>
  ): Promise<UserPlacesPreference | null> {
    const preference = await UserPlacesPreference.findPreferenceById(userId, placeId);
    if (!preference) return null;
    Object.assign(preference, data);
    return await preference.save();
  }

  static async deletePreference(userId: number, placeId: number): Promise<boolean> {
    const preference = await UserPlacesPreference.findPreferenceById(userId, placeId);
    if (!preference) return false;
    await preference.remove();
    return true;
  }
}
