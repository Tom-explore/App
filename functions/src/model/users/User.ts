import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
  } from 'typeorm';
  
  @Entity('users')
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column('varchar', { unique: true })
    email!: string;
  
    @Column('varchar')
    name!: string;
  
    @Column('varchar')
    pw!: string;
  
    @Column('varchar', { nullable: true })
    fb_id!: string;
  
    @Column('varchar', { nullable: true })
    google_id!: string;
  
    @Column('varchar', { nullable: true })
    apple_id!: string;
  
    @Column('varchar', { nullable: true })
    profile_img!: string;
  
    @Column('boolean', { default: null })
    confirmed_account!: boolean;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @Column('boolean', { default: false })
    admin!: boolean;
  
    @Column('boolean', { default: false })
    author!: boolean;
  
    @Column('int', { nullable: true })
    favorite_language!: number;
  
    constructor(
      email: string,
      name: string,
      pw: string,
      fb_id: string = '',
      google_id: string = '',
      apple_id: string = '',
      profile_img: string = '',
      confirmed_account: boolean = false,
      admin: boolean = false,
      author: boolean = false,
      favorite_language: number = null
    ) {
      super();
      this.email = email;
      this.name = name;
      this.pw = pw;
      this.fb_id = fb_id;
      this.google_id = google_id;
      this.apple_id = apple_id;
      this.profile_img = profile_img;
      this.confirmed_account = confirmed_account;
      this.admin = admin;
      this.author = author;
      this.favorite_language = favorite_language;
    }
  }
  