import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

export const BackOfficeUserSeed = async (prisma: PrismaClient) => {
  const hashedPassword = await hash('Ilikeyesboss1234!', 10);
  return await prisma.backOfficeUser.create({
    data: {
      email: 'yba@yba.ai',
      firstName: 'YBA',
      lastName: 'admin',
      isRemoved: false,
      password: hashedPassword,
    },
  });
};
