import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://mindwrite-frontend.vercel.app',
      'https://mindwrite-frontend-git-main-aysenciftci23s-projects.vercel.app', // Vercel preview URL'lerini de eklemek iyi olabilir
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
