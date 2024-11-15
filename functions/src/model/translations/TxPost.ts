import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Post } from '../blog/Post';
  import { Language } from '../translations/Language';
  
  @Entity('tx_posts')
  export class TxPost extends BaseEntity {
    @PrimaryColumn({ name: 'post_id' })
    postId!: number;
  
    @PrimaryColumn({ name: 'language_id' })
    languageId!: number;
  
    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post!: Post;
  
    @ManyToOne(() => Language, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'language_id' })
    language!: Language;
  
    @Column('varchar', { nullable: false })
    name!: string;
  
    @Column('varchar', { nullable: true })
    description!: string;
  
    @Column('varchar', { nullable: true })
    metaDescription!: string;
  
    @Column('varchar', { nullable: true })
    title!: string;
  
    @Column('boolean', { default: false })
    visible!: boolean;
  
    @Column('varchar', { nullable: false })
    slug!: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
  
    @Column('timestamp', { nullable: true })
    planned!: Date;
  
    constructor(
      post: Post,
      language: Language,
      name: string,
      slug: string,
      description: string = '',
      metaDescription: string = '',
      title: string = '',
      visible: boolean = false,
      planned: Date | null = null
    ) {
      super();
      this.post = post;
      this.language = language;
      this.name = name;
      this.slug = slug;
      this.description = description;
      this.metaDescription = metaDescription;
      this.title = title;
      this.visible = visible;
      this.planned = planned;
    }
  }
  