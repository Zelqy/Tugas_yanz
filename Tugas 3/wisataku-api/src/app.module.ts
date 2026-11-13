import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DestinasiModule } from './destinasi/destinasi.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, DestinasiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
