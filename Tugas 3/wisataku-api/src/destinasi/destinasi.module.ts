import { Module } from '@nestjs/common';
import { DestinasiController } from './destinasi.controller';
import { DestinasiService } from './destinasi.service';

@Module({
  controllers: [DestinasiController],
  providers: [DestinasiService],
  exports: [DestinasiService],
})
export class DestinasiModule {}
