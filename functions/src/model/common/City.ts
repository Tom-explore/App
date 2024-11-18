import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Country } from './Country';

@Entity('cities')
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { nullable: true })
  parent_city_id?: number;

  @Column('varchar')
  slug!: string;

  @Column('float', { nullable: true })
  lat!: number;

  @Column('float', { nullable: true })
  lng!: number;

  @Column('varchar', { nullable: true })
  video!: string;

  @Column('varchar', { nullable: true })
  main_img!: string;

  @Column('varchar', { nullable: true })
  img_marker!: string;

  @Column('int', { nullable: true })
  attraction_min_reviews!: number;

  @Column('boolean', { default: false })
  visible!: boolean;

  @Column('varchar', { nullable: true })
  scrapio!: string;

  @Column('varchar', { nullable: true })
  gyg!: string;

  @Column('varchar', { nullable: true })
  timezone!: string;

  @Column('smallint', { nullable: true })
  duration!: number;

  @Column('varchar', { nullable: true })
  link_city_card!: string;

  @Column('varchar', { nullable: true })
  link_taxi!: string;

  @Column('varchar', { nullable: true })
  link_car_rental!: string;

  @Column('varchar', { nullable: true })
  link_bike_rental!: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  constructor() {
    super();
  }

  static async createCity(data: Partial<City>): Promise<City> {
    const city = Object.assign(new City(), data);
    return await city.save();
  }

  static async findById(id: number): Promise<City | null> {
    return await City.findOne({ where: { id }, relations: ['country'] });
  }

  static async findAll(): Promise<City[]> {
    return await City.find({ relations: ['country'] });
  }

  static async updateCity(id: number, data: Partial<City>): Promise<City | null> {
    const city = await City.findById(id);
    if (!city) return null;
    Object.assign(city, data);
    return await city.save();
  }

  static async deleteCity(id: number): Promise<boolean> {
    const city = await City.findById(id);
    if (!city) return false;
    await city.remove();
    return true;
  }
}
