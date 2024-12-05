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

  @Column('boolean', { default: true })
  visible!: boolean;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @ManyToOne(() => Place, { nullable: true })
  @JoinColumn({ name: 'place_id' })
  place!: Place;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne(() => PostImg, { nullable: true })
  @JoinColumn({ name: 'post_img_id' })
  postImg!: PostImg;

  @ManyToOne(() => PlaceImg, { nullable: true })
  @JoinColumn({ name: 'place_img_id' })
  placeImg!: PlaceImg;

  constructor() {
    super();
  }

  static async createBloc(data: Partial<PostBloc>): Promise<PostBloc> {
    const bloc = Object.assign(new PostBloc(), data);
    return await bloc.save();
  }

  static async findById(id: number): Promise<PostBloc | null> {
    return await PostBloc.findOne({ where: { id }, relations: ['post', 'postImg', 'placeImg', 'city', 'place', 'country'] });
  }

  static async findAll(): Promise<PostBloc[]> {
    return await PostBloc.find({ relations: ['post', 'postImg', 'placeImg', 'city', 'place', 'country'] });
  }

  static async updateBloc(id: number, data: Partial<PostBloc>): Promise<PostBloc | null> {
    const bloc = await PostBloc.findOneBy({ id });
    if (!bloc) return null;
    Object.assign(bloc, data);
    return await bloc.save();
  }

  static async deleteBloc(id: number): Promise<boolean> {
    const bloc = await PostBloc.findOneBy({ id });
    if (!bloc) return false;
    await bloc.remove();
    return true;
  }
}
