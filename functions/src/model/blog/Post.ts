import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BaseEntity,
  } from 'typeorm';
  import { User } from '../users/User';
  
  @Entity('posts')
  export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User;
  
    @Column('varchar', { nullable: false })
    slug!: string;
  
    constructor(user: User, slug: string) {
      super();
      this.user = user;
      this.slug = slug;
    }
  }
  