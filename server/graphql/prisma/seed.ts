import { PrismaClient } from '@prisma/client';
import allSeed from './seed/index';

const prisma = new PrismaClient();

const main = async () => {
  await allSeed(prisma);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
