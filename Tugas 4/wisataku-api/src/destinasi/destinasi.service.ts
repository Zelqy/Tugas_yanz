import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinasiDto } from './dto/create-destinasi.dto';
import { UpdateDestinasiDto } from './dto/update-destinasi.dto';

@Injectable()
export class DestinasiService {
  constructor(private prisma: PrismaService) {}

  async findAll(kategori?: string) {
    return this.prisma.destinasi.findMany({
      where: kategori ? { kategori } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const destinasi = await this.prisma.destinasi.findUnique({
      where: { id },
    });
    if (!destinasi) {
      throw new NotFoundException(`Destinasi dengan id ${id} tidak ditemukan`);
    }
    return destinasi;
  }

  async create(dto: CreateDestinasiDto) {
    return this.prisma.destinasi.create({ data: dto });
  }

  async update(id: number, dto: UpdateDestinasiDto) {
    await this.findOne(id);
    return this.prisma.destinasi.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.destinasi.delete({ where: { id } });
    return { message: 'Destinasi telah dihapus' };
  }
}
