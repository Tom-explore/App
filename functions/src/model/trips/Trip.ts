import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../users/User';
import { City } from '../common/City';

@Entity('trips')
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => City, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @Column('int', { nullable: true })
  partner_id!: number;

  @Column('boolean', { default: false })
  public!: boolean;

  @Column('timestamp', { nullable: false })
  datetime_start!: Date;

  @Column('timestamp', { nullable: false })
  datetime_end!: Date;

  @Column('smallint', { nullable: true })
  price_range!: number;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  modified!: Date;

  constructor() {
    super();
  }

  static async createTrip(data: Partial<Trip>): Promise<Trip> {
    const trip = Object.assign(new Trip(), data);
    return await trip.save();
  }

  static async findById(id: number): Promise<Trip | null> {
    return await Trip.findOne({ where: { id }, relations: ['user', 'city'] });
  }

  static async findByUser(userId: number): Promise<Trip[]> {
    return await Trip.find({ where: { user: { id: userId } }, relations: ['user', 'city'] });
  }

  static async updateTrip(id: number, data: Partial<Trip>): Promise<Trip | null> {
    const trip = await Trip.findById(id);
    if (!trip) return null;
    Object.assign(trip, data);
    return await trip.save();
  }

  static async deleteTrip(id: number): Promise<boolean> {
    const trip = await Trip.findById(id);
    if (!trip) return false;
    await trip.remove();
    return true;
  }
}
