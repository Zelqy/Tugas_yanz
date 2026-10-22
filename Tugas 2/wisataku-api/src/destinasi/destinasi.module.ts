import { Module } from '@nestjs/common';
import { DestinasiController } from './destinasi.controller';

@Module({
  controllers: [DestinasiController]
})
export class DestinasiModule {}
