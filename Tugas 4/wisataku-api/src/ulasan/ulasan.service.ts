import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UlasanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { destinasiId: number; rating: number; komentar: string }) {
    return this.prisma.ulasan.create({ data });
  }

  async findByDestinasi(destinasiId: number) {
    return this.prisma.ulasan.findMany({
      where: { destinasiId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
