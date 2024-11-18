import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Trip } from './Trip';
import { Place } from '../places/Place';

@Entity('trip_composition')
export class TripComposition extends BaseEntity {
  @PrimaryColumn()
  trip_id!: number;

  @PrimaryColumn()
  day!: number;

  @PrimaryColumn()
  position!: number;

  @PrimaryColumn()
  place_id!: number;

  @Column('timestamp', { nullable: true })
  datetime!: Date;

  @Column('boolean', { nullable: true })
  deleted!: boolean;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ManyToOne(() => Place, { nullable: false })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  constructor() {
    super();
  }

  static async createComposition(data: Partial<TripComposition>): Promise<TripComposition> {
    const composition = Object.assign(new TripComposition(), data);
    return await composition.save();
  }

  static async findCompositionById(tripId: number, day: number, position: number): Promise<TripComposition | null> {
    return await TripComposition.findOne({
      where: { trip_id: tripId, day, position },
      relations: ['trip', 'place'],
    });
  }

  static async findCompositionsByTrip(tripId: number): Promise<TripComposition[]> {
    return await TripComposition.find({
      where: { trip_id: tripId },
      relations: ['trip', 'place'],
    });
  }

  static async updateComposition(
    tripId: number,
    day: number,
    position: number,
    data: Partial<TripComposition>
  ): Promise<TripComposition | null> {
    const composition = await TripComposition.findCompositionById(tripId, day, position);
    if (!composition) return null;
    Object.assign(composition, data);
    return await composition.save();
  }

  static async deleteComposition(tripId: number, day: number, position: number): Promise<boolean> {
    const composition = await TripComposition.findCompositionById(tripId, day, position);
    if (!composition) return false;
    await composition.remove();
    return true;
  }
}
