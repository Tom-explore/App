import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Place } from './Place';

@Entity('opening_hours')
export class OpeningHours extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Place, { nullable: false })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @Column('smallint', { nullable: false })
  day_of_week!: number;

  @Column('time', { nullable: true })
  start_time_1!: string;

  @Column('time', { nullable: true })
  stop_time_1!: string;

  @Column('time', { nullable: true })
  start_time_2!: string;

  @Column('time', { nullable: true })
  stop_time_2!: string;

  constructor() {
    super();
  }

  static async createOpeningHour(data: Partial<OpeningHours>): Promise<OpeningHours> {
    const openingHour = Object.assign(new OpeningHours(), data);
    return await openingHour.save();
  }

  static async findById(id: number): Promise<OpeningHours | null> {
    return await OpeningHours.findOne({ where: { id }, relations: ['place'] });
  }

  static async findByPlace(placeId: number): Promise<OpeningHours[]> {
    return await OpeningHours.find({ where: { place: { id: placeId } }, relations: ['place'] });
  }

  static async updateOpeningHour(id: number, data: Partial<OpeningHours>): Promise<OpeningHours | null> {
    const openingHour = await OpeningHours.findById(id);
    if (!openingHour) return null;
    Object.assign(openingHour, data);
    return await openingHour.save();
  }

  static async deleteOpeningHour(id: number): Promise<boolean> {
    const openingHour = await OpeningHours.findById(id);
    if (!openingHour) return false;
    await openingHour.remove();
    return true;
  }
}
