import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

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

  constructor(
    slug: string,
    is_food_restriction: boolean = null,
    is_atmosphere: boolean = null
  ) {
    super();
    this.slug = slug;
    this.is_food_restriction = is_food_restriction;
    this.is_atmosphere = is_atmosphere;
  }
}
