// backend/src/posts/posts.service.ts (TAM HALİ)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
        private tagsService: TagsService,
    ) { }

    async create(dto: CreatePostDto, userId: number, tagIds?: number[]) {
        console.log('🔥 CREATE POST - Status:', dto.status);

        const post = this.postRepo.create({
            title: dto.title,
            content: dto.content,
            excerpt: dto.excerpt ?? dto.content.substring(0, 100),
            status: dto.status || 'published',
            author: { id: userId },
        });

        if (tagIds && tagIds.length > 0) {
            const tags = await this.tagsService.findByIds(tagIds);
            post.tags = tags;
        }

        const savedPost = await this.postRepo.save(post);
        console.log('✅ POST SAVED - ID:', savedPost.id, 'Status:', savedPost.status);

        return savedPost;
    }

    async findAll() {
        return this.postRepo.find({
            relations: ['author', 'tags', 'comments'],
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number) {
        const post = await this.postRepo.findOne({
            where: { id },
            relations: ['author', 'tags', 'comments'],
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    async update(id: number, dto: UpdatePostDto, tagIds?: number[]) {
        const post = await this.findOne(id);

        Object.assign(post, dto);

        if (tagIds) {
            const tags = await this.tagsService.findByIds(tagIds);
            post.tags = tags;
        }

        return this.postRepo.save(post);
    }

    async remove(id: number) {
        const result = await this.postRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Post not found');
        }
    }
}