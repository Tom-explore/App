import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from './Place';

@Entity('hotels')
export class Hotel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @Column('varchar', { nullable: true })
  booking_link!: string;

  @Column('smallint', { nullable: true })
  avg_price_per_night!: number;

  @Column('boolean', { default: false })
  pets_authorized!: boolean;


  constructor() {
    super();
  }



  static async createHotel(data: Partial<Hotel>): Promise<Hotel> {
    const hotel = Object.assign(new Hotel(), data);
    return await hotel.save();
  }

  static async findById(id: number): Promise<Hotel | null> {
    return await Hotel.findOne({ where: { id }, relations: ['city'] });
  }

  static async findAll(): Promise<Hotel[]> {
    return await Hotel.find({ relations: ['city'] });
  }

  static async updateHotel(id: number, data: Partial<Hotel>): Promise<Hotel | null> {
    const hotel = await Hotel.findById(id);
    if (!hotel) return null;
    Object.assign(hotel, data);
    return await hotel.save();
  }

  static async deleteHotel(id: number): Promise<boolean> {
    const hotel = await Hotel.findById(id);
    if (!hotel) return false;
    await hotel.remove();
    return true;
  }
}
