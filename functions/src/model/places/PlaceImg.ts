import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from './Place';

@Entity('place_imgs')
export class PlaceImg extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('varchar', { nullable: true })
  author!: string;

  @Column('varchar', { nullable: true })
  license!: string;

  @Column('smallint', { nullable: true })
  top!: number;

  @Column('varchar', { nullable: true })
  source!: string;

  constructor() {
    super();
  }

  static async createPlaceImg(data: Partial<PlaceImg>): Promise<PlaceImg> {
    const placeImg = Object.assign(new PlaceImg(), data);
    return await placeImg.save();
  }

  static async findById(id: number): Promise<PlaceImg | null> {
    return await PlaceImg.findOne({ where: { id }, relations: ['place'] });
  }

  static async findByPlace(placeId: number): Promise<PlaceImg[]> {
    return await PlaceImg.find({ where: { place: { id: placeId } }, relations: ['place'] });
  }

  static async updatePlaceImg(id: number, data: Partial<PlaceImg>): Promise<PlaceImg | null> {
    const placeImg = await PlaceImg.findById(id);
    if (!placeImg) return null;
    Object.assign(placeImg, data);
    return await placeImg.save();
  }

  static async deletePlaceImg(id: number): Promise<boolean> {
    const placeImg = await PlaceImg.findById(id);
    if (!placeImg) return false;
    await placeImg.remove();
    return true;
  }
}
