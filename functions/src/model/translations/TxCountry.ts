import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Country } from '../common/Country';
import { Language } from './Language';

@Entity('tx_country')
export class TxCountry extends BaseEntity {
  @PrimaryColumn()
  country_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  meta_description!: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxCountry(data: Partial<TxCountry>): Promise<TxCountry> {
    const txCountry = Object.assign(new TxCountry(), data);
    return await txCountry.save();
  }

  static async findByCountryAndLanguage(countryId: number, languageId: number): Promise<TxCountry | null> {
    return await TxCountry.findOne({
      where: { country_id: countryId, language_id: languageId },
      relations: ['country', 'language'],
    });
  }

  static async findByCountry(countryId: number): Promise<TxCountry[]> {
    return await TxCountry.find({
      where: { country_id: countryId },
      relations: ['country', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxCountry[]> {
    return await TxCountry.find({
      where: { language_id: languageId },
      relations: ['country', 'language'],
    });
  }

  static async updateTxCountry(countryId: number, languageId: number, data: Partial<TxCountry>): Promise<TxCountry | null> {
    const txCountry = await TxCountry.findByCountryAndLanguage(countryId, languageId);
    if (!txCountry) return null;
    Object.assign(txCountry, data);
    return await txCountry.save();
  }

  static async deleteTxCountry(countryId: number, languageId: number): Promise<boolean> {
    const txCountry = await TxCountry.findByCountryAndLanguage(countryId, languageId);
    if (!txCountry) return false;
    await txCountry.remove();
    return true;
  }
}
