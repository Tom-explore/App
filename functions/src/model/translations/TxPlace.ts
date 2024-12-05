import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Place } from '../places/Place';
import { Language } from './Language';

@Entity('tx_place')
export class TxPlace extends BaseEntity {
  @PrimaryColumn()
  place_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar', { nullable: true })
  description!: string;

  @Column('varchar', { nullable: true })
  meta_description!: string;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxPlace(data: Partial<TxPlace>): Promise<TxPlace> {
    const txPlace = Object.assign(new TxPlace(), data);
    return await txPlace.save();
  }

  static async findByPlaceAndLanguage(placeId: number, languageId: number): Promise<TxPlace | null> {
    return await TxPlace.findOne({
      where: { place_id: placeId, language_id: languageId },
      relations: ['place', 'language'],
    });
  }

  static async findByPlace(placeId: number): Promise<TxPlace[]> {
    return await TxPlace.find({
      where: { place_id: placeId },
      relations: ['place', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxPlace[]> {
    return await TxPlace.find({
      where: { language_id: languageId },
      relations: ['place', 'language'],
    });
  }

  static async updateTxPlace(placeId: number, languageId: number, data: Partial<TxPlace>): Promise<TxPlace | null> {
    const txPlace = await TxPlace.findByPlaceAndLanguage(placeId, languageId);
    if (!txPlace) return null;
    Object.assign(txPlace, data);
    return await txPlace.save();
  }

  static async deleteTxPlace(placeId: number, languageId: number): Promise<boolean> {
    const txPlace = await TxPlace.findByPlaceAndLanguage(placeId, languageId);
    if (!txPlace) return false;
    await txPlace.remove();
    return true;
  }
}
