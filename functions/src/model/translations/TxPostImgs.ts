// import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { PostImg } from '../images/PostImg';
// import { Language } from './Language';

// @Entity('Tx_post_img')
// export class TxPostImg {
//   @PrimaryColumn()
//   post_img_id!: number;

//   @PrimaryColumn()
//   language_id!: number;

//   @Column('varchar')
//   alt!: string;

//   @ManyToOne(() => PostImg)
//   @JoinColumn({ name: 'post_img_id' })
//   postImg!: PostImg;

//   @ManyToOne(() => Language)
//   @JoinColumn({ name: 'language_id' })
//   language!: Language;

//   constructor(postImg: PostImg, language: Language, alt: string) {
//     this.postImg = postImg;
//     this.language = language;
//     this.alt = alt;
//   }
// }
