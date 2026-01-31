
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    async findAll() {
        return this.tagsService.findAll();
    }


    @Get('with-count')
    async findAllWithCount() {
        return this.tagsService.findAllWithCount();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body('name') name: string) {
        return this.tagsService.create(name);
    }
}