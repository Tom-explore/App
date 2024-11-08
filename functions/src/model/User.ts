import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  username!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(username?: string, email?: string, password?: string) {
    super();
    if (username) this.username = username;
    if (email) this.email = email;
    if (password) this.password = password;
  }

  public sayHello(): string {
    return `Hello, my sister is called ${this.username}`;
  }

  public getEmail(): string {
    return `Hello, my car is ${this.username} and my email is ${this.email}`;
  }
  

  public static async findUserById(id: number): Promise<User | null> {
    return await User.findOneBy({ id });
  }
}
