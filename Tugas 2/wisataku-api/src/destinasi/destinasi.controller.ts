import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateDestinasiDto } from './dto/create-destinasi.dto';
import { UpdateDestinasiDto } from './dto/update-destinasi.dto';

@ApiTags('Destinasi')
@Controller('destinasi')
export class DestinasiController {
  // Data dummy sementara (Bab 3 akan diganti dengan Prisma)
  private data = [
    { id: 1, nama: 'Pantai Kuta Mandalika', kategori: 'Pantai', hargaTiket: 15000 },
    { id: 2, nama: 'Gunung Rinjani', kategori: 'Gunung', hargaTiket: 250000 },
  ];

  @Get()
  @ApiOperation({ summary: 'Menampilkan daftar destinasi wisata' })
  @ApiQuery({ name: 'kategori', required: false, description: 'Filter berdasarkan kategori' })
  @ApiResponse({ status: 200, description: 'Daftar destinasi berhasil diambil' })
  findAll(@Query('kategori') kategori?: string) {
    if (kategori) {
      return this.data.filter((d) => d.kategori.toLowerCase() === kategori.toLowerCase());
    }
    return this.data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan detail satu destinasi' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Detail destinasi' })
  @ApiResponse({ status: 404, description: 'Destinasi tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const destinasi = this.data.find((d) => d.id === id);
    if (!destinasi) {
      return { message: `Destinasi dengan id ${id} tidak ditemukan` };
    }
    return destinasi;
  }

  @Post()
  @ApiOperation({ summary: 'Menambahkan destinasi baru (khusus admin)' })
  @ApiResponse({ status: 201, description: 'Destinasi berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  create(@Body() dto: CreateDestinasiDto) {
    const newDestinasi = { id: this.data.length + 1, ...dto };
    this.data.push(newDestinasi);
    return newDestinasi;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mengubah sebagian data destinasi (khusus admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Destinasi berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Destinasi tidak ditemukan' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDestinasiDto) {
    const destinasi = this.data.find((d) => d.id === id);
    if (!destinasi) {
      return { message: `Destinasi dengan id ${id} tidak ditemukan` };
    }
    Object.assign(destinasi, dto);
    return destinasi;
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Menghapus destinasi (khusus admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Destinasi berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Destinasi tidak ditemukan' })
  remove(@Param('id', ParseIntPipe) id: number) {
    const index = this.data.findIndex((d) => d.id === id);
    if (index === -1) {
      return { message: `Destinasi dengan id ${id} tidak ditemukan` };
    }
    this.data.splice(index, 1);
    return { message: 'Destinasi berhasil dihapus' };
  }
}