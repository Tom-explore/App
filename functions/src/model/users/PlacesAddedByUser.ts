import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Place } from '../places/Place';

@Entity('places_added_by_user')
export class PlacesAddedByUser {
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

  constructor(user: User, place: Place) {
    this.user = user;
    this.place = place;
  }
}
