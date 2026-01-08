import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule'ü tüm app genelinde kullanılabilir yapar
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');

        // Eğer Render URL verirse onu kullan, SSL ayarını yap
        if (url) {
          return {
            type: 'postgres',
            url: url,
            autoLoadEntities: true,
            synchronize: true,
            ssl: { rejectUnauthorized: false }, // Render için zorunlu
          };
        }

        // Local ortam için .env dosyasındaki değerleri kullan
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', '123456'),
          database: configService.get<string>('DB_NAME', 'mindWrite'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: false, // Localde SSL gerekmez
        };
      },
    }),
    PostsModule,
    CommentsModule,
    TagsModule,
    AuthModule,
  ],
})
export class AppModule { }