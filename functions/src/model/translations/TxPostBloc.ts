// import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { PostBloc } from '../posts/PostBloc';
// import { Language } from './Language';

// @Entity('Tx_post_bloc')
// export class TxPostBloc {
//   @PrimaryColumn()
//   post_bloc_id!: number;

//   @PrimaryColumn()
//   language_id!: number;

//   @Column('varchar')
//   content!: string;

//   @Column('varchar')
//   title!: string;

//   @ManyToOne(() => PostBloc)
//   @JoinColumn({ name: 'post_bloc_id' })
//   postBloc!: PostBloc;

//   @ManyToOne(() => Language)
//   @JoinColumn({ name: 'language_id' })
//   language!: Language;

//   constructor(postBloc: PostBloc, language: Language, content: string, title: string) {
//     this.postBloc = postBloc;
//     this.language = language;
//     this.content = content;
//     this.title = title;
//   }
// }
