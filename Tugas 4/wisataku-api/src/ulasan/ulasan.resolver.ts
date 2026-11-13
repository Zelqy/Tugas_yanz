import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { Ulasan } from './entities/ulasan.entity';
import { CreateUlasanInput } from './dto/create-ulasan.input';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => Ulasan)
export class UlasanResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation(() => Ulasan, { name: 'tambahUlasan' })
  async tambahUlasan(@Args('input') input: CreateUlasanInput) {
    return this.prisma.ulasan.create({ data: input });
  }

  @Query(() => [Ulasan], { name: 'ulasanByDestinasi' })
  async ulasanByDestinasi(@Args('destinasiId', { type: () => Int }) destinasiId: number) {
    return this.prisma.ulasan.findMany({
      where: { destinasiId },
      orderBy: { createdAt: 'desc' },
    });
  }
}