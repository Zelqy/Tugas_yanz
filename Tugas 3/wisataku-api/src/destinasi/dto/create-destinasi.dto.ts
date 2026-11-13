import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateDestinasiDto {
  @ApiProperty({ example: 'Pantai Kuta Mandalika', description: 'Nama destinasi wisata' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({ example: 'Pantai', description: 'Kategori destinasi (Pantai, Gunung, Budaya, Kuliner)' })
  @IsString()
  @IsNotEmpty()
  kategori: string;

  @ApiProperty({ example: 15000, description: 'Harga tiket masuk dalam Rupiah' })
  @IsNumber()
  @Min(0)
  hargaTiket: number;
}
