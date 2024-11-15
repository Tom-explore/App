import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('post_imgs')
export class PostImg extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  slug!: string;

  @Column('smallint', { nullable: true })
  position!: number;

  @Column('varchar', { nullable: true })
  author!: string;

  @Column('varchar', { nullable: true })
  license!: string;

  @Column('varchar', { nullable: true })
  directory!: string;

  @Column('varchar', { nullable: true })
  source!: string;

  constructor(
    slug: string,
    position: number | null = null,
    author: string = '',
    license: string = '',
    directory: string = '',
    source: string = ''
  ) {
    super();
    this.slug = slug;
    this.position = position;
    this.author = author;
    this.license = license;
    this.directory = directory;
    this.source = source;
  }
}
