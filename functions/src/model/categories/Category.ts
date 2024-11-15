import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('boolean', { default: false })
  main!: boolean;

  @Column('boolean', { default: false })
  for_trip_form!: boolean;

  @Column('boolean', { default: false })
  for_posts!: boolean;

  @Column('varchar', { nullable: true })
  scrapio_name!: string;

  constructor(
    slug: string,
    main: boolean = false,
    for_trip_form: boolean = false,
    for_posts: boolean = false,
    scrapio_name: string = ''
  ) {
    super();
    this.slug = slug;
    this.main = main;
    this.for_trip_form = for_trip_form;
    this.for_posts = for_posts;
    this.scrapio_name = scrapio_name;
  }
}
