import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
  } from 'typeorm';
  import { User } from '../users/User';
  import { City } from '../common/City';
  
  @Entity('trips')
  export class Trip extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User;
  
    @ManyToOne(() => City, { nullable: false })
    @JoinColumn({ name: 'city_id' })
    city!: City;
  
    @Column('int', { nullable: true })
    partner_id!: number;
  
    @Column('boolean', { default: false })
    public!: boolean;
  
    @Column('timestamp', { nullable: false })
    datetime_start!: Date;
  
    @Column('timestamp', { nullable: false })
    datetime_end!: Date;
  
    @Column('smallint', { nullable: true })
    price_range!: number;
  
    @CreateDateColumn()
    created!: Date;
  
    @UpdateDateColumn()
    modified!: Date;
  
    constructor(
      user: User,
      city: City,
      datetime_start: Date,
      datetime_end: Date,
      partner_id: number = null,
      public_flag: boolean = false,
      price_range: number = null
    ) {
      super();
      this.user = user;
      this.city = city;
      this.datetime_start = datetime_start;
      this.datetime_end = datetime_end;
      this.partner_id = partner_id;
      this.public = public_flag;
      this.price_range = price_range;
    }
  }
  