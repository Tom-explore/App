import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}
