
import { Controller, Get, Post, Body, Request, UseGuards, Param, Put, Delete, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(Number(id));
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role('admin', 'editor')
    @Post()
    create(@Body() dto: CreatePostDto, @Request() req) {
        return this.postsService.create(dto, req.user.id, dto.tagIds);
    }


    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role('admin', 'editor')
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Request() req) {
        const post = await this.postsService.findOne(Number(id));


        if (req.user.role !== 'admin' && post.author.id !== req.user.id) {
            throw new ForbiddenException('Bu yazıyı güncelleme yetkiniz yok');
        }

        return this.postsService.update(Number(id), dto, dto.tagIds);
    }


    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role('admin', 'editor')
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        const post = await this.postsService.findOne(Number(id));


        if (req.user.role !== 'admin' && post.author.id !== req.user.id) {
            throw new ForbiddenException('Bu yazıyı silme yetkiniz yok');
        }

        return this.postsService.remove(Number(id));
    }
}