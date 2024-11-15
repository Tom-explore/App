import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BaseEntity,
  } from 'typeorm';
  import { Post } from './Post';
  import { PostImg } from './PostImg';
  import { PlaceImg } from '../places/PlaceImg';
  import { TitleType } from '../enums/TitleType';
  import { Template } from '../enums/Template';
  import { City } from '../common/City';
  import { Place } from '../places/Place';
  import { Country } from '../common/Country';
  
  @Entity('post_blocs')
  export class PostBloc extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'post_id' })
    post!: Post;
  
    @ManyToOne(() => PostImg, { nullable: true })
    @JoinColumn({ name: 'post_img_id' })
    postImg!: PostImg;
  
    @ManyToOne(() => PlaceImg, { nullable: true })
    @JoinColumn({ name: 'place_img_id' })
    placeImg!: PlaceImg;
  
    @Column('smallint', { nullable: false })
    position!: number;
  
    @Column({
      type: 'enum',
      enum: TitleType,
      nullable: false,
    })
    titleType!: TitleType;
  
    @Column({
      type: 'enum',
      enum: Template,
      nullable: false,
    })
    template!: Template;
  
    @ManyToOne(() => City, { nullable: true })
    @JoinColumn({ name: 'city_id' })
    city!: City;
  
    @ManyToOne(() => Place, { nullable: true })
    @JoinColumn({ name: 'place_id' })
    place!: Place;
  
    @ManyToOne(() => Country, { nullable: true })
    @JoinColumn({ name: 'country_id' })
    country!: Country;
  
    @Column('boolean', { default: true })
    visible!: boolean;
  
    constructor(
      post: Post,
      position: number,
      titleType: TitleType,
      template: Template,
      visible: boolean = true
    ) {
      super();
      this.post = post;
      this.position = position;
      this.titleType = titleType;
      this.template = template;
      this.visible = visible;
    }
  }
  