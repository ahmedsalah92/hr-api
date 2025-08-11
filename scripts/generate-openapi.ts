import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function run(): Promise<void> {
  process.env['SKIP_DB_CONNECT'] = '1';
  const app = await NestFactory.create(AppModule, { logger: false });
  const cfg = new DocumentBuilder()
    .setTitle('HR API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, cfg);
  writeFileSync('openapi.json', JSON.stringify(doc, null, 2), 'utf-8');
  await app.close();
}
void run();
