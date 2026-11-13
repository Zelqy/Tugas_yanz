import { Module } from '@nestjs/common';
import { DestinasiController } from './destinasi.controller';
import { DestinasiService } from './destinasi.service';
import { DestinasiResolver } from './destinasi.resolver';

@Module({
  controllers: [DestinasiController],
  providers: [DestinasiService, DestinasiResolver],
  exports: [DestinasiService],
})
export class DestinasiModule {}
