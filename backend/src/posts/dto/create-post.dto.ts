// backend/src/posts/dto/create-post.dto.ts (SADECE BUNU TUT)
import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    tagIds?: number[];
}
// ⚠️ SERVICE METODLARI BURADA OLMAZ! ⚠️