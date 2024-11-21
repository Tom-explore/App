import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { PostImg } from '../blog/PostImg';
import { Language } from './Language';

@Entity('tx_post_img')
export class TxPostImg extends BaseEntity {
  @PrimaryColumn()
  post_img_id!: number;

  @PrimaryColumn()
  language_id!: number;

  @Column('varchar')
  alt!: string;

  @ManyToOne(() => PostImg)
  @JoinColumn({ name: 'post_img_id' })
  postImg!: PostImg;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  constructor() {
    super();
  }

  static async createTxPostImg(data: Partial<TxPostImg>): Promise<TxPostImg> {
    const txPostImg = Object.assign(new TxPostImg(), data);
    return await txPostImg.save();
  }

  static async findByPostImgAndLanguage(postImgId: number, languageId: number): Promise<TxPostImg | null> {
    return await TxPostImg.findOne({
      where: { post_img_id: postImgId, language_id: languageId },
      relations: ['postImg', 'language'],
    });
  }

  static async findByPostImg(postImgId: number): Promise<TxPostImg[]> {
    return await TxPostImg.find({
      where: { post_img_id: postImgId },
      relations: ['postImg', 'language'],
    });
  }

  static async findByLanguage(languageId: number): Promise<TxPostImg[]> {
    return await TxPostImg.find({
      where: { language_id: languageId },
      relations: ['postImg', 'language'],
    });
  }

  static async updateTxPostImg(postImgId: number, languageId: number, data: Partial<TxPostImg>): Promise<TxPostImg | null> {
    const txPostImg = await TxPostImg.findByPostImgAndLanguage(postImgId, languageId);
    if (!txPostImg) return null;
    Object.assign(txPostImg, data);
    return await txPostImg.save();
  }

  static async deleteTxPostImg(postImgId: number, languageId: number): Promise<boolean> {
    const txPostImg = await TxPostImg.findByPostImgAndLanguage(postImgId, languageId);
    if (!txPostImg) return false;
    await txPostImg.remove();
    return true;
  }
}
