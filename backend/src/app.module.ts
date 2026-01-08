import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',      // 👈 NET
      database: 'mindWrite',
      autoLoadEntities: true,  // 👈 KRİTİK
      synchronize: true,
    }),
    PostsModule,
    CommentsModule,
    TagsModule,
    AuthModule,
  ],
})
export class AppModule { }
