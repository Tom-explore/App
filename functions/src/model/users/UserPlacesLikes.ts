import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Place } from '../places/Place';

@Entity('user_places_likes')
export class UserPlacesLikes {
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

  constructor(user: User, place: Place, liked: boolean) {
    this.user = user;
    this.place = place;
    this.liked = liked;
  }
}
