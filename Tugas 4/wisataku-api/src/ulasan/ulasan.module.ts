import { Module } from '@nestjs/common';
import { UlasanResolver } from './ulasan.resolver';
import { UlasanService } from './ulasan.service';

@Module({
  providers: [UlasanResolver, UlasanService],
  exports: [UlasanService],
})
export class UlasanModule {}
