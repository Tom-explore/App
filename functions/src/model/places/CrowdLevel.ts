import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Place } from './Place';
import { CrowdStatus } from '../enums/CrowdStatus';

@Entity('crowd_levels')
export class CrowdLevels extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Place, { nullable: false })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @Column('smallint', { nullable: false })
  day_of_week!: number;

  @Column('time', { nullable: false })
  hour!: string;

  @Column({
    type: 'enum',
    enum: CrowdStatus,
    nullable: false,
  })
  status!: CrowdStatus;

  constructor() {
    super();
  }

  static async createCrowdLevel(data: Partial<CrowdLevels>): Promise<CrowdLevels> {
    const crowdLevel = Object.assign(new CrowdLevels(), data);
    return await crowdLevel.save();
  }

  static async findById(id: number): Promise<CrowdLevels | null> {
    return await CrowdLevels.findOne({ where: { id }, relations: ['place'] });
  }

  static async findByPlace(placeId: number): Promise<CrowdLevels[]> {
    return await CrowdLevels.find({ where: { place: { id: placeId } }, relations: ['place'] });
  }

  static async updateCrowdLevel(id: number, data: Partial<CrowdLevels>): Promise<CrowdLevels | null> {
    const crowdLevel = await CrowdLevels.findById(id);
    if (!crowdLevel) return null;
    Object.assign(crowdLevel, data);
    return await crowdLevel.save();
  }

  static async deleteCrowdLevel(id: number): Promise<boolean> {
    const crowdLevel = await CrowdLevels.findById(id);
    if (!crowdLevel) return false;
    await crowdLevel.remove();
    return true;
  }
}
