import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { City } from '../common/City';
import { Language } from './Language';

@Entity('tx_city')
export class TxCity extends BaseEntity {
  @PrimaryColumn()
  city_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  meta_description!: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxCity(data: Partial<TxCity>): Promise<TxCity> {
    const txCity = Object.assign(new TxCity(), data);
    return await txCity.save();
  }

  static async findByCityAndLanguage(cityId: number, languageId: number): Promise<TxCity | null> {
    return await TxCity.findOne({
      where: { city_id: cityId, language_id: languageId },
      relations: ['city', 'language'],
    });
  }

  static async findByCity(cityId: number): Promise<TxCity[]> {
    return await TxCity.find({
      where: { city_id: cityId },
      relations: ['city', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxCity[]> {
    return await TxCity.find({
      where: { language_id: languageId },
      relations: ['city', 'language'],
    });
  }

  static async updateTxCity(cityId: number, languageId: number, data: Partial<TxCity>): Promise<TxCity | null> {
    const txCity = await TxCity.findByCityAndLanguage(cityId, languageId);
    if (!txCity) return null;
    Object.assign(txCity, data);
    return await txCity.save();
  }

  static async deleteTxCity(cityId: number, languageId: number): Promise<boolean> {
    const txCity = await TxCity.findByCityAndLanguage(cityId, languageId);
    if (!txCity) return false;
    await txCity.remove();
    return true;
  }
}
