// backend/src/auth/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Post } from '../posts/posts.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  password: string;

  @Column({ default: 'editor' })
  role: string; // 'admin' veya 'editor'

  @CreateDateColumn() // 🔥 BU SATIRI EKLE
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}