import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Post } from '../posts/posts.entity';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column()
    authorName: string;

    @ManyToOne(() => Post, post => post.comments, {
        onDelete: 'CASCADE',
    })
    post: Post;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}
