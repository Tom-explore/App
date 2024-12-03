import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('countries')
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  code!: string;

  @Column('varchar')
  slug!: string;

  @Column('varchar', { nullable: true })
  currency!: string;

  constructor() {
    super();
  }

  static async createCountry(data: Partial<Country>): Promise<Country> {
    const country = Object.assign(new Country(), data);
    return await country.save();
  }

  static async findById(id: number): Promise<Country | null> {
    return await Country.findOneBy({ id });
  }

  static async findAll(): Promise<Country[]> {
    return await Country.find();
  }

  static async updateCountry(id: number, data: Partial<Country>): Promise<Country | null> {
    const country = await Country.findById(id);
    if (!country) return null;
    Object.assign(country, data);
    return await country.save();
  }

  static async deleteCountry(id: number): Promise<boolean> {
    const country = await Country.findById(id);
    if (!country) return false;
    await country.remove();
    return true;
  }
}
