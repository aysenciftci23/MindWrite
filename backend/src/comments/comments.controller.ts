import { Controller, Post as HttpPost, Get, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @HttpPost()
    create(@Body() dto: CreateCommentDto) {
        return this.commentsService.create(dto);
    }

    @Get('/post/:postId')
    findByPost(@Param('postId') postId: string) {
        return this.commentsService.findByPost(Number(postId));
    }
}
