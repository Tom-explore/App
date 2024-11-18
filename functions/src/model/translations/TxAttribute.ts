import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Attribute } from '../categories/Attribute';
import { Language } from './Language';

@Entity('tx_attribute')
export class TxAttribute extends BaseEntity {
  @PrimaryColumn()
  attribute_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  meta_description!: string;

  @Column('varchar')
  title!: string;

  @ManyToOne(() => Attribute)
  @JoinColumn({ name: 'attribute_id' })
  attribute!: Attribute;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxAttribute(data: Partial<TxAttribute>): Promise<TxAttribute> {
    const txAttribute = Object.assign(new TxAttribute(), data);
    return await txAttribute.save();
  }

  static async findByAttributeAndLanguage(attributeId: number, languageId: number): Promise<TxAttribute | null> {
    return await TxAttribute.findOne({
      where: { attribute_id: attributeId, language_id: languageId },
      relations: ['attribute', 'language'],
    });
  }

  static async findByAttribute(attributeId: number): Promise<TxAttribute[]> {
    return await TxAttribute.find({ where: { attribute_id: attributeId }, relations: ['attribute', 'language'] });
  }

  static async findByLanguage(languageId: number): Promise<TxAttribute[]> {
    return await TxAttribute.find({ where: { language_id: languageId }, relations: ['attribute', 'language'] });
  }

  static async updateTxAttribute(attributeId: number, languageId: number, data: Partial<TxAttribute>): Promise<TxAttribute | null> {
    const txAttribute = await TxAttribute.findByAttributeAndLanguage(attributeId, languageId);
    if (!txAttribute) return null;
    Object.assign(txAttribute, data);
    return await txAttribute.save();
  }

  static async deleteTxAttribute(attributeId: number, languageId: number): Promise<boolean> {
    const txAttribute = await TxAttribute.findByAttributeAndLanguage(attributeId, languageId);
    if (!txAttribute) return false;
    await txAttribute.remove();
    return true;
  }
}
