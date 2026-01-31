import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn, 
    DeleteDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Comment } from '../comments/comment.entity';
import { Tag } from '../tags/tags.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    excerpt: string;

    @Column({ default: 'draft' })
    status: string;

    @CreateDateColumn() 
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    author: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @ManyToMany(() => Tag, (tag) => tag.posts)
    @JoinTable()
    tags: Tag[];
}