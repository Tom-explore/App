import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Language } from '../translations/Language';

@Entity('partners')
export class Partner {
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

  constructor(
    name: string,
    website: string = '',
    contact_mail: string = '',
    phone: string = '',
    gyg_id: string = '',
    booking_id: string = '',
    favorite_language: Language = null
  ) {
    this.name = name;
    this.website = website;
    this.contact_mail = contact_mail;
    this.phone = phone;
    this.gyg_id = gyg_id;
    this.booking_id = booking_id;
    this.favorite_language = favorite_language;
  }
}
