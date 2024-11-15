import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  code!: string;

  constructor(slug: string, code: string) {
    this.slug = slug;
    this.code = code;
  }
}
