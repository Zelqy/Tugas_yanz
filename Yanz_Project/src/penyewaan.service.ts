import { PrismaClient } from '@prisma/client';
import type { CreateRentalDto, UpdateRentalDto } from './dto';

export const prisma = new PrismaClient();

const DEFAULT_BRAND = 'Honda';
const DEFAULT_MODEL = 'Vario 160';

function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().split(' ').join(' ');
}

function slugEmail(name: string): string {
  return name.trim().toLowerCase().split(' ').join('.') + '@example.com';
}

async function resolveVehicle(plate: string) {
  const clean = normalizePlate(plate);
  const found = await prisma.vehicle.findUnique({ where: { plate: clean } });
  if (found) return found;
  return prisma.vehicle.create({ data: { plate: clean, brand: DEFAULT_BRAND, model: DEFAULT_MODEL } });
}

export async function createRental(dto: CreateRentalDto) {
  const customerName = dto.customerName.trim();
  const email = (dto.customerEmail || '').trim() || slugEmail(customerName);

  const customer = await prisma.customer.upsert({
    where: { email },
    update: { name: customerName },
    create: { name: customerName, email }
  });

  const vehicle = await resolveVehicle(dto.vehiclePlate);

  const rental = await prisma.rental.create({
    data: {
      customerId: customer.id,
      vehicleId: vehicle.id,
      rentalDate: new Date(dto.rentalDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      totalCost: dto.totalCost
    },
    include: { customer: true, vehicle: true }
  });

  const transaction = await prisma.transaction.create({
    data: {
      rentalId: rental.id,
      customerId: customer.id,
      amount: dto.amount,
      method: (dto.method || 'CASH').toUpperCase()
    }
  });

  return { rental, transaction };
}

export async function updateRental(id: number, dto: UpdateRentalDto) {
  const existing = await prisma.rental.findUnique({ where: { id } });
  if (!existing) return null;

  const data: {
    rentalDate?: Date;
    endDate?: Date;
    totalCost?: number;
    vehicleId?: number;
  } = {};

  if (dto.rentalDate) data.rentalDate = new Date(dto.rentalDate);
  if (dto.endDate) data.endDate = new Date(dto.endDate);
  if (typeof dto.totalCost === 'number') data.totalCost = dto.totalCost;
  if (dto.vehiclePlate) {
    const vehicle = await resolveVehicle(dto.vehiclePlate);
    data.vehicleId = vehicle.id;
  }

  return prisma.rental.update({
    where: { id },
    data,
    include: { customer: true, vehicle: true }
  });
}

export function listRentals() {
  return prisma.rental.findMany({
    orderBy: { id: 'asc' },
    include: { customer: true, vehicle: true }
  });
}

export function getRentalById(id: number) {
  return prisma.rental.findUnique({
    where: { id },
    include: { customer: true, vehicle: true, transactions: true }
  });
}

export function listTransactions() {
  return prisma.transaction.findMany({
    orderBy: { id: 'asc' },
    include: { customer: true, rental: { include: { vehicle: true } } }
  });
}

export function getTransactionById(id: number) {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      customer: true,
      rental: { include: { customer: true, vehicle: true } }
    }
  });
}
