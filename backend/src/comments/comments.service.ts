import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from '../posts/posts.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) { }

    async create(dto: CreateCommentDto): Promise<Comment> {
        const post = await this.postRepository.findOne({
            where: { id: dto.postId },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = this.commentRepository.create({
            content: dto.content,
            authorName: dto.authorName,
            post,
        });

        return this.commentRepository.save(comment);
    }

    async findByPost(postId: number): Promise<Comment[]> {
        return this.commentRepository.find({
            where: { post: { id: postId } },
            order: { createdAt: 'DESC' },
        });
    }
}
