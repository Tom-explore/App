import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { TxAttribute } from '../translations/TxAttribute';

@Entity('attributes')
export class Attribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('boolean', { nullable: true })
  is_food_restriction!: boolean;

  @Column('boolean', { nullable: true })
  is_atmosphere!: boolean;
  @OneToMany(() => TxAttribute, (txAttribute) => txAttribute.attribute, { cascade: true })
  translations!: TxAttribute[];

  constructor() {
    super();
  }

  static async createAttribute(data: Partial<Attribute>): Promise<Attribute> {
    const attribute = Object.assign(new Attribute(), data);
    return await attribute.save();
  }

  static async findById(id: number): Promise<Attribute | null> {
    return await Attribute.findOneBy({ id });
  }

  static async findAll(): Promise<Attribute[]> {
    return await Attribute.find();
  }

  static async updateAttribute(id: number, data: Partial<Attribute>): Promise<Attribute | null> {
    const attribute = await Attribute.findById(id);
    if (!attribute) return null;
    Object.assign(attribute, data);
    return await attribute.save();
  }

  static async deleteAttribute(id: number): Promise<boolean> {
    const attribute = await Attribute.findById(id);
    if (!attribute) return false;
    await attribute.remove();
    return true;
  }
}
