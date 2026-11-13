import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DestinasiModule } from './destinasi/destinasi.module';
import { UlasanModule } from './ulasan/ulasan.module';
import { FasilitasModule } from './fasilitas/fasilitas.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PrismaModule,
    DestinasiModule,
    UlasanModule,
    FasilitasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
