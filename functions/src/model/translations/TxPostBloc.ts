import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { PostBloc } from '../blog/PostBloc';
import { Language } from './Language';

@Entity('tx_post_bloc')
export class TxPostBloc extends BaseEntity {
  @PrimaryColumn()
  post_bloc_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  content!: string;

  @Column('varchar')
  title!: string;

  @ManyToOne(() => PostBloc)
  @JoinColumn({ name: 'post_bloc_id' })
  postBloc!: PostBloc;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxPostBloc(data: Partial<TxPostBloc>): Promise<TxPostBloc> {
    const txPostBloc = Object.assign(new TxPostBloc(), data);
    return await txPostBloc.save();
  }

  static async findByPostBlocAndLanguage(postBlocId: number, languageId: number): Promise<TxPostBloc | null> {
    return await TxPostBloc.findOne({
      where: { post_bloc_id: postBlocId, language_id: languageId },
      relations: ['postBloc', 'language'],
    });
  }

  static async findByPostBloc(postBlocId: number): Promise<TxPostBloc[]> {
    return await TxPostBloc.find({
      where: { post_bloc_id: postBlocId },
      relations: ['postBloc', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxPostBloc[]> {
    return await TxPostBloc.find({
      where: { language_id: languageId },
      relations: ['postBloc', 'language'],
    });
  }

  static async updateTxPostBloc(postBlocId: number, languageId: number, data: Partial<TxPostBloc>): Promise<TxPostBloc | null> {
    const txPostBloc = await TxPostBloc.findByPostBlocAndLanguage(postBlocId, languageId);
    if (!txPostBloc) return null;
    Object.assign(txPostBloc, data);
    return await txPostBloc.save();
  }

  static async deleteTxPostBloc(postBlocId: number, languageId: number): Promise<boolean> {
    const txPostBloc = await TxPostBloc.findByPostBlocAndLanguage(postBlocId, languageId);
    if (!txPostBloc) return false;
    await txPostBloc.remove();
    return true;
  }
}
