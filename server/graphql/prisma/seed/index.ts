import { PrismaClient } from '@prisma/client';
import { UserSeed } from './User';
import { BackOfficeUserSeed } from './BackOfficeUser';

const allSeed = async (prisma: PrismaClient) => {
  await UserSeed(prisma);
  await BackOfficeUserSeed(prisma);
};

export default allSeed;
