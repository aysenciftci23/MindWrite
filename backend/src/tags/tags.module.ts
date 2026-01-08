// backend/src/tags/tags.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller'; // BU SATIR VAR MI?

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagsController], // BU SATIR VAR MI?
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule { }