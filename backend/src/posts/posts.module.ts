// backend/src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './posts.entity';
import { TagsModule } from '../tags/tags.module'; // Bunu import et

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        TagsModule, // 🔥 BU SATIRI EKLE - TagsService'i kullanmak için
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule { }