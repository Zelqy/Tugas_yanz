import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan ValidationPipe global — otomatis memvalidasi DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,     // buang field yang tidak didefinisikan di DTO
      transform: true,     // ubah tipe data otomatis (string → number)
    }),
  );

  // Konfigurasi dokumen OpenAPI
  const config = new DocumentBuilder()
    .setTitle('WisataKu API')
    .setDescription('API untuk platform informasi dan reservasi destinasi wisata')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Ekspor dokumen OpenAPI ke file JSON (untuk luaran Tugas 2)
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  await app.listen(3000);
  console.log('🚀 Aplikasi berjalan di http://localhost:3000');
  console.log('📘 Swagger UI: http://localhost:3000/api/docs');
}
bootstrap();