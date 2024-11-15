import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
  } from 'typeorm';
  import { Post } from './Post';
  import { Category } from '../categories/Category';
  
  @Entity('post_categorizations')
  export class PostCategorization extends BaseEntity {
    @PrimaryColumn({ name: 'post_id' })
    postId!: number;
  
    @PrimaryColumn({ name: 'category_id' })
    categoryId!: Category;
  
    @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'post_id' })
    post!: Post;
  
    @ManyToOne(() => Category, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'category_id' })
    category!: Category;
  
    @Column('boolean', { nullable: true })
    main!: boolean;
  
    constructor(post: Post, category: Category, main: boolean = false) {
      super();
      this.post = post;
      this.category = category;
      this.main = main;
    }
  }
  