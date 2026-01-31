
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './posts.entity';
import { TagsModule } from '../tags/tags.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        TagsModule,
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule { }