import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: proce.envss.NODE_ENV === 'dev',
    cors: {
      credentials: true,
      origin:
        process.env.NODE_ENV === 'dev'
          ? 'http://localhost:5000'
          : 'http://tuyenduong.tuoitrebachkhoa.edu.vn',
    },
  });

  const config = new DocumentBuilder()
    .setTitle('BK Achievement API')
    .setDescription('The API for BK Achievement Platform.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  await app.listen(process.env.PORT || 5001);
}
bootstrap();
