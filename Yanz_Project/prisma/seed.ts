import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const NIM_3 = '011';

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();

  const rina = await prisma.customer.create({
    data: { name: 'Rina Wijaya ' + NIM_3, email: 'rina.' + NIM_3 + '@example.com', address: 'Jl. Merdeka No. 11' }
  });
  const budi = await prisma.customer.create({
    data: { name: 'Budi Santoso ' + NIM_3, email: 'budi.' + NIM_3 + '@example.com', address: 'Jl. Sudirman No. 22' }
  });
  const vario = await prisma.vehicle.create({
    data: { brand: 'Honda', model: 'Vario 160', plate: 'B 1011 XYZ' }
  });
  const avanza = await prisma.vehicle.create({
    data: { brand: 'Toyota', model: 'Avanza', plate: 'D 2011 ' + NIM_3 }
  });

  const rental1 = await prisma.rental.create({
    data: {
      customerId: rina.id,
      vehicleId: vario.id,
      rentalDate: new Date('2026-11-01T08:00:00.000Z'),
      endDate: new Date('2026-11-05T08:00:00.000Z'),
      totalCost: 750000
    }
  });
  const rental2 = await prisma.rental.create({
    data: {
      customerId: budi.id,
      vehicleId: avanza.id,
      rentalDate: new Date('2026-11-02T08:00:00.000Z'),
      endDate: new Date('2026-11-07T08:00:00.000Z'),
      totalCost: 1500000
    }
  });

  const tx1 = await prisma.transaction.create({
    data: { rentalId: rental1.id, customerId: rina.id, amount: 750000, method: 'TRANSFER' }
  });
  const tx2 = await prisma.transaction.create({
    data: { rentalId: rental2.id, customerId: budi.id, amount: 1500000, method: 'CASH' }
  });

  console.log('Seed selesai. rental ids =', rental1.id, rental2.id, '| transaction ids =', tx1.id, tx2.id, '| NIM suffix =', NIM_3);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
