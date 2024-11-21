import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('languages')
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  name!: string;

  constructor() {
    super();
  }

  static async createLanguage(data: Partial<Language>): Promise<Language> {
    const language = Object.assign(new Language(), data);
    return await language.save();
  }

  static async findById(id: number): Promise<Language | null> {
    return await Language.findOneBy({ id });
  }

  static async findAll(): Promise<Language[]> {
    return await Language.find();
  }

  static async updateLanguage(id: number, data: Partial<Language>): Promise<Language | null> {
    const language = await Language.findById(id);
    if (!language) return null;
    Object.assign(language, data);
    return await language.save();
  }

  static async deleteLanguage(id: number): Promise<boolean> {
    const language = await Language.findById(id);
    if (!language) return false;
    await language.remove();
    return true;
  }
}
