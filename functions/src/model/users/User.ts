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

  constructor() {
    super();
  }

  static async createUser(data: Partial<User>): Promise<User> {
    const user = Object.assign(new User(), data);
    return await user.save();
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOneBy({ email });
  }

  static async findById(id: number): Promise<User | null> {
    return await User.findOneBy({ id });
  }

  static async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const user = await User.findOneBy({ id });
    if (!user) return null;
    Object.assign(user, data);
    return await user.save();
  }

  static async deleteUser(id: number): Promise<boolean> {
    const user = await User.findOneBy({ id });
    if (!user) return false;
    await user.remove();
    return true;
  }
}
