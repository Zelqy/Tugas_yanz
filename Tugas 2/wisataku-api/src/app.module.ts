import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DestinasiModule } from './destinasi/destinasi.module';

@Module({
  imports: [DestinasiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
