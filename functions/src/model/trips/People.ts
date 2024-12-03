import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Trip } from './Trip';

@Entity('people')
export class People extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('smallint', { nullable: true })
  age!: number;

  @ManyToOne(() => Trip, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  constructor() {
    super();
  }

  static async createPerson(data: Partial<People>): Promise<People> {
    const person = Object.assign(new People(), data);
    return await person.save();
  }

  static async findById(id: number): Promise<People | null> {
    return await People.findOne({ where: { id }, relations: ['trip'] });
  }

  static async findByTrip(tripId: number): Promise<People[]> {
    return await People.find({ where: { trip: { id: tripId } }, relations: ['trip'] });
  }

  static async updatePerson(id: number, data: Partial<People>): Promise<People | null> {
    const person = await People.findById(id);
    if (!person) return null;
    Object.assign(person, data);
    return await person.save();
  }

  static async deletePerson(id: number): Promise<boolean> {
    const person = await People.findById(id);
    if (!person) return false;
    await person.remove();
    return true;
  }
}
