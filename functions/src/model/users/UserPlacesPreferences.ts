import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Place } from '../places/Place';

@Entity('user_places_preferences')
export class UserPlacesPreferences {
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

  constructor(
    user: User,
    place: Place,
    wants_to_visit: boolean = false,
    visited: boolean = false,
    not_interested: boolean = false
  ) {
    this.user = user;
    this.place = place;
    this.wants_to_visit = wants_to_visit;
    this.visited = visited;
    this.not_interested = not_interested;
  }
}
