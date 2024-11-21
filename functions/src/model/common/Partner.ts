import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Language } from '../translations/Language';

@Entity('partners')
export class Partner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('varchar', { nullable: true })
  website!: string;

  @Column('varchar', { nullable: true })
  contact_mail!: string;

  @Column('varchar', { nullable: true })
  phone!: string;

  @Column('varchar', { nullable: true })
  gyg_id!: string;

  @Column('varchar', { nullable: true })
  booking_id!: string;

  @ManyToOne(() => Language, { nullable: true })
  @JoinColumn({ name: 'favorite_language' })
  favorite_language!: Language;

  constructor() {
    super();
  }

  static async createPartner(data: Partial<Partner>): Promise<Partner> {
    const partner = Object.assign(new Partner(), data);
    return await partner.save();
  }

  static async findById(id: number): Promise<Partner | null> {
    return await Partner.findOne({ where: { id }, relations: ['favorite_language'] });
  }

  static async findAll(): Promise<Partner[]> {
    return await Partner.find({ relations: ['favorite_language'] });
  }

  static async updatePartner(id: number, data: Partial<Partner>): Promise<Partner | null> {
    const partner = await Partner.findById(id);
    if (!partner) return null;
    Object.assign(partner, data);
    return await partner.save();
  }

  static async deletePartner(id: number): Promise<boolean> {
    const partner = await Partner.findById(id);
    if (!partner) return false;
    await partner.remove();
    return true;
  }
}
